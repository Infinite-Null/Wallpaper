import { z } from "zod";

import categories from "../enums/category.js";

// Valid categories enum
export const WALLPAPER_CATEGORIES = categories;

// Valid wallpaper styles
export const WALLPAPER_STYLES = [ "anime", "real" ];

// Create wallpaper schema
export const createWallpaperSchema = z.object( {
    title: z
        .string()
        .min( 3, "Title must be at least 3 characters long" )
        .max( 200, "Title must be less than 200 characters" )
        .trim(),
    description: z
        .string()
        .min( 10, "Description must be at least 10 characters long" )
        .max( 1000, "Description must be less than 1000 characters" )
        .trim(),
    imageUrl: z
        .string()
        .url( "Please provide a valid URL" )
        .trim(),
    keywords: z
        .array( z.string().trim() )
        .min( 1, "At least one keyword is required" )
        .max( 20, "Maximum 20 keywords allowed" ),
    category: z.enum( WALLPAPER_CATEGORIES, {
        errorMap: () => ( { message: `Category must be one of: ${ WALLPAPER_CATEGORIES.join( ", " ) }` } )
    } ),
    wallpaperStyle: z.enum( WALLPAPER_STYLES, {
        errorMap: () => ( { message: `Style must be either 'anime' or 'real'` } )
    } ),
} );

// Update wallpaper schema (all fields optional)
export const updateWallpaperSchema = z.object( {
    title: z
        .string()
        .min( 3, "Title must be at least 3 characters long" )
        .max( 200, "Title must be less than 200 characters" )
        .trim()
        .optional(),
    description: z
        .string()
        .min( 10, "Description must be at least 10 characters long" )
        .max( 1000, "Description must be less than 1000 characters" )
        .trim()
        .optional(),
    imageUrl: z
        .string()
        .url( "Please provide a valid URL" )
        .trim()
        .optional(),
    keywords: z
        .array( z.string().trim() )
        .min( 1, "At least one keyword is required" )
        .max( 20, "Maximum 20 keywords allowed" )
        .optional(),
    category: z.enum( WALLPAPER_CATEGORIES, {
        errorMap: () => ( { message: `Category must be one of: ${ WALLPAPER_CATEGORIES.join( ", " ) }` } )
    } ).optional(),
    wallpaperStyle: z.enum( WALLPAPER_STYLES, {
        errorMap: () => ( { message: `Style must be either 'anime' or 'real'` } )
    } ).optional(),
    isActive: z.boolean().optional(),
} );

// Get wallpapers query schema
export const getWallpapersQuerySchema = z.object( {
    page: z.string().optional().transform( val => parseInt( val || "1" ) ),
    limit: z.string().optional().transform( val => parseInt( val || "10" ) ),
    category: z.enum( [ ...WALLPAPER_CATEGORIES, "all" ] ).optional().default( "all" ),
    wallpaperStyle: z.enum( [ ...WALLPAPER_STYLES, "all" ] ).optional().default( "all" ),
    keyword: z.string().optional(),
    sortBy: z.enum( [ "createdAt", "downloadCount", "title" ] ).optional().default( "createdAt" ),
    sortOrder: z.enum( [ "asc", "desc" ] ).optional().default( "desc" ),
    isActive: z.string().optional().transform( val => val === "true" ? true : val === "false" ? false : undefined ),
} );
