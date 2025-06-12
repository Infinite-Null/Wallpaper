/**
 * Wallpaper Controller
 * @module controller/wallpaper
 */
import mongoose from "mongoose";

import { asyncHandler } from "../middleware/error-handler.js";
import Wallpaper from "../models/wallpaper.js";
import {
    createWallpaperSchema,
    getWallpapersQuerySchema,
    updateWallpaperSchema,
    WALLPAPER_CATEGORIES,
    WALLPAPER_STYLES
} from "../schema/wallpaper.schema.js";
import response from "../template/response.js";
import { formatZodErrors } from "../utils/zod-format.js";

/**
 * Create a new wallpaper
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing wallpaper details
 * @param {Object} req.user - User object from auth middleware
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing created wallpaper
 */
const createWallpaper = asyncHandler( async ( req, res ) => {
    const result = createWallpaperSchema.safeParse( req.body );

    if ( !result.success ) {
        return response(
            res,
            false,
            400,
            "Invalid input parameters",
            formatZodErrors( result.error )
        );
    }

    // Add adminId from authenticated user
    const wallpaperData = {
        ...result.data,
        adminId: req.user._id
    };

    const wallpaper = new Wallpaper( wallpaperData );
    await wallpaper.save();

    return response(
        res,
        true,
        201,
        "Wallpaper created successfully",
        wallpaper
    );
} );

/**
 * Update wallpaper details
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Wallpaper ID
 * @param {Object} req.body - Updated wallpaper details
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing updated wallpaper
 */
const updateWallpaper = asyncHandler( async ( req, res ) => {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        return response( res, false, 400, "Invalid wallpaper ID" );
    }

    const result = updateWallpaperSchema.safeParse( req.body );

    if ( !result.success ) {
        return response(
            res,
            false,
            400,
            "Invalid input parameters",
            formatZodErrors( result.error )
        );
    }

    const wallpaper = await Wallpaper.findByIdAndUpdate(
        id,
        result.data,
        { new: true, runValidators: true }
    );

    if ( !wallpaper ) {
        return response( res, false, 404, "Wallpaper not found" );
    }

    return response(
        res,
        true,
        200,
        "Wallpaper updated successfully",
        wallpaper
    );
} );

/**
 * Delete wallpaper
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Wallpaper ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object confirming deletion
 */
const deleteWallpaper = asyncHandler( async ( req, res ) => {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        return response( res, false, 400, "Invalid wallpaper ID" );
    }

    const wallpaper = await Wallpaper.findByIdAndDelete( id );

    if ( !wallpaper ) {
        return response( res, false, 404, "Wallpaper not found" );
    }

    return response(
        res,
        true,
        200,
        "Wallpaper deleted successfully"
    );
} );

/**
 * Get wallpaper by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Wallpaper ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing wallpaper details
 */
const getWallpaperById = asyncHandler( async ( req, res ) => {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        return response( res, false, 400, "Invalid wallpaper ID" );
    }

    const wallpaper = await Wallpaper.findById( id )
        .populate( "adminId", "firstName lastName email" );

    if ( !wallpaper ) {
        return response( res, false, 404, "Wallpaper not found" );
    }

    // Increment download count when wallpaper is viewed
    await wallpaper.incrementDownloadCount();

    return response(
        res,
        true,
        200,
        "Wallpaper retrieved successfully",
        wallpaper
    );
} );

/**
 * Get paginated wallpapers with filters
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters for filtering
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing paginated wallpapers
 */
const getWallpapers = asyncHandler( async ( req, res ) => {
    const result = getWallpapersQuerySchema.safeParse( req.query );

    if ( !result.success ) {
        return response(
            res,
            false,
            400,
            "Invalid query parameters",
            formatZodErrors( result.error )
        );
    }

    const {
        page,
        limit,
        category,
        wallpaperStyle,
        keyword,
        sortBy,
        sortOrder,
        isActive
    } = result.data;

    const skip = ( page - 1 ) * limit;

    // Build filter query
    const filter = {};

    if ( category && category !== "all" ) {
        filter.category = category;
    }

    if ( wallpaperStyle && wallpaperStyle !== "all" ) {
        filter.wallpaperStyle = wallpaperStyle;
    }

    if ( keyword ) {
        filter.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            // eslint-disable-next-line security/detect-non-literal-regexp
            { keywords: { $in: [ new RegExp( keyword, "i" ) ] } }
        ];
    }

    if ( isActive !== undefined ) {
        filter.isActive = isActive;
    }

    // Build sort query
    const sort = {};
    sort[ sortBy ] = sortOrder === "asc" ? 1 : -1;

    // Get wallpapers and total count
    const [ wallpapers, totalWallpapers ] = await Promise.all( [
        Wallpaper.find( filter )
            .populate( "adminId", "firstName lastName email" )
            .skip( skip )
            .limit( limit )
            .sort( sort ),
        Wallpaper.countDocuments( filter )
    ] );

    const totalPages = Math.ceil( totalWallpapers / limit );

    const paginationData = {
        wallpapers,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalWallpapers: totalWallpapers,
            limit: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };

    return response(
        res,
        true,
        200,
        "Wallpapers retrieved successfully",
        paginationData
    );
} );

/**
 * Get home screen data
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing home screen data
 */
const getHomeScreenData = asyncHandler( async ( req, res ) => {
    // Get featured wallpapers (most downloaded)
    const featuredWallpapers = await Wallpaper.find( { isActive: true } )
        .sort( { downloadCount: -1 } )
        .limit( 10 )
        .select( "title imageUrl category wallpaperStyle downloadCount" );

    // Get recent wallpapers
    const recentWallpapers = await Wallpaper.find( { isActive: true } )
        .sort( { createdAt: -1 } )
        .limit( 10 )
        .select( "title imageUrl category wallpaperStyle createdAt" );

    // Get wallpapers by category (3 from each category)
    const categoryPromises = WALLPAPER_CATEGORIES.map( async ( category ) => {
        const wallpapers = await Wallpaper.find( { 
            category, 
            isActive: true 
        } )
            .sort( { downloadCount: -1 } )
            .limit( 3 )
            .select( "title imageUrl wallpaperStyle downloadCount" );

        return {
            category,
            wallpapers
        };
    } );

    const wallpapersByCategory = await Promise.all( categoryPromises );

    // Filter out categories with no wallpapers
    const categoriesWithWallpapers = wallpapersByCategory.filter( 
        cat => cat.wallpapers.length > 0 
    );

    // Get statistics
    const [ totalWallpapers, totalDownloads ] = await Promise.all( [
        Wallpaper.countDocuments( { isActive: true } ),
        Wallpaper.aggregate( [
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$downloadCount" } } }
        ] )
    ] );

    const homeData = {
        featured: featuredWallpapers,
        recent: recentWallpapers,
        categories: categoriesWithWallpapers,
        statistics: {
            totalWallpapers,
            totalDownloads: totalDownloads[ 0 ]?.total || 0,
            availableCategories: WALLPAPER_CATEGORIES,
            availableStyles: WALLPAPER_STYLES
        }
    };

    return response(
        res,
        true,
        200,
        "Home screen data retrieved successfully",
        homeData
    );
} );

/**
 * Increment download count for a wallpaper
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Wallpaper ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with updated download count
 */
const incrementDownload = asyncHandler( async ( req, res ) => {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        return response( res, false, 400, "Invalid wallpaper ID" );
    }

    const wallpaper = await Wallpaper.findById( id );

    if ( !wallpaper ) {
        return response( res, false, 404, "Wallpaper not found" );
    }

    const newCount = await wallpaper.incrementDownloadCount();

    return response(
        res,
        true,
        200,
        "Download count incremented successfully",
        { downloadCount: newCount }
    );
} );

export {
    createWallpaper, deleteWallpaper, getHomeScreenData, getWallpaperById,
    getWallpapers, incrementDownload, updateWallpaper
};

