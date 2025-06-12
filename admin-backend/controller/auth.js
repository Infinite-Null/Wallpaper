/**
 * Admin Auth Controller
 * @module controller/auth
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../middleware/error-handler.js";
import AdminUser from "../models/user.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import response from "../template/response.js";
import { formatZodErrors } from "../utils/zod-format.js";

/**
 * Registers a new admin user in the system.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user details
 * @param {string} req.body.firstName - First name of the user
 * @param {string} req.body.lastName - Last name of the user
 * @param {string} [req.body.role='admin'] - Role of the user
 * @param {string} req.body.email - Email address of the user
 * @param {string} req.body.password - Password for the user account
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing:
 *                           - success status
 *                           - JWT token
 *                           - user details (firstName, lastName, role, email)
 */
const register = asyncHandler( async ( req, res ) => {
    const result = registerSchema.safeParse( req.body );

    if ( !result.success ) {
        return response(
            res,
            false,
            400,
            "Invalid input parameters",
            formatZodErrors( result.error )
        );
    }

    const { firstName, lastName, role, email, password } = result.data;

    const existingUser = await AdminUser.findOne( {
        email: email.toLowerCase(),
    } );

    if ( existingUser ) {
        return response(
            res,
            false,
            400,
            "Email already exists, please use another email"
        );
    }

    const encryptedPassword = await bcrypt.hash( password, 10 );

    const newUser = new AdminUser( {
        firstName,
        lastName,
        role: role || "admin",
        email: email.toLowerCase(),
        password: encryptedPassword
    } );

    await newUser.save();

    const { password: _, ...user } = newUser.toObject();

    return response( 
        res, 
        true,
        201,
        "User registered successfully",
        { 
            firstName: user.firstName, 
            lastName: user.lastName,
            role: user.role,
            email: user.email 
        }
    );
} );

/**
 * Handles admin user authentication through login
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing:
 *                           - success status (boolean)
 *                           - status code (number)
 *                           - message (string)
 *                           - data (object) with jwt token and user details on successful login
 */
const login = asyncHandler( async ( req, res ) => {
    const result = loginSchema.safeParse( req.body );
    
    if ( !result.success ) {
        return response(
            res,
            false,
            400,
            "Invalid input parameters",
            formatZodErrors( result.error.issues )
        );
    }

    const user = await AdminUser.findOne( {
        email: result.data.email.toLowerCase(),
    } );

    if ( !user ) {
        return response(
            res,
            false,
            400,
            "Invalid email or password"
        );
    }

    const isPasswordValid = await bcrypt.compare( result.data.password, user.password );

    if ( !isPasswordValid ) {
        return response(
            res,
            false,
            400,
            "Invalid email or password"
        );
    }

    const { JWT_SECRET, JWT_EXPIRE } = process.env;

    const { password: _, ...userData } = user.toObject();
    const token = jwt.sign( userData, JWT_SECRET, { expiresIn: JWT_EXPIRE } );

    return response( 
        res, 
        true, 
        200,
        "Login successful",
        {
            firstName: user.firstName, 
            lastName: user.lastName,
            role: user.role,
            email: user.email 
        },
        [
            { 
                key: "access_token", 
                value: token,
                options: { httpOnly: true, secure: true } 
            }
        ] 
    );
} );

/**
 * Handles admin user logout by clearing the access token cookie
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing:
 *                           - success status (boolean)
 *                           - status code (number)
 *                           - message (string)
 */
const logout = asyncHandler( ( req, res ) => {
    res.clearCookie( "access_token" );

    return response( res, true, 200, "Logout successful" );
} );

/**
 * Retrieves the current authenticated admin user's details
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing:
 *                           - success status (boolean)
 *                           - status code (number)
 *                           - message (string)
 *                           - data (object) with user details excluding version, token expiry and issue time
 */
const me = asyncHandler( ( req, res ) => {
    const { __v, iat: _iat, exp: _exp, ...user } = req.user;

    return response( res, true, 200, "User details retrieved successfully", user );
} );

/**
 * Get all admin users with pagination
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing paginated admin users
 */
const getAdmins = asyncHandler( async ( req, res ) => {
    const page = parseInt( req.query.page ) || 1;
    const limit = parseInt( req.query.limit ) || 10;
    const skip = ( page - 1 ) * limit;

    // Get admins without password field
    const [ admins, totalAdmins ] = await Promise.all( [
        AdminUser.find()
            .select( '-password' )
            .skip( skip )
            .limit( limit )
            .sort( { createdAt: -1 } ),
        AdminUser.countDocuments()
    ] );

    const totalPages = Math.ceil( totalAdmins / limit );

    const paginationData = {
        admins,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalAdmins: totalAdmins,
            limit: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };

    return response( res, true, 200, 'Admins retrieved successfully', paginationData );
} );

/**
 * Get admin user by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Admin user ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing admin user details
 */
const getAdminById = asyncHandler( async ( req, res ) => {
    const admin = await AdminUser.findById( req.params.id ).select( '-password' );
    
    if ( !admin ) {
        return response( res, false, 404, 'Admin not found' );
    }

    return response( res, true, 200, 'Admin retrieved successfully', admin );
} );

/**
 * Delete admin user by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Admin user ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object confirming deletion
 */
const deleteAdmin = asyncHandler( async ( req, res ) => {
    const adminId = req.params.id;

    // Prevent admin from deleting themselves
    if ( req.user._id.toString() === adminId ) {
        return response( res, false, 400, 'You cannot delete your own account' );
    }

    const admin = await AdminUser.findById( adminId );
    
    if ( !admin ) {
        return response( res, false, 404, 'Admin not found' );
    }

    await AdminUser.findByIdAndDelete( adminId );

    return response( res, true, 200, 'Admin deleted successfully' );
} );

export {
    deleteAdmin, getAdminById, getAdmins, login, logout, me, register
};

