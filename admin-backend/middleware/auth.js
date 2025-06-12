/**
 * Middleware for verifying JWT tokens from the `Authorization` header in incoming requests.
 * 
 * @module middleware/authMiddleware
 */
import jwt from 'jsonwebtoken';

import response from '../template/response.js';

/**
 * Authentication middleware to verify JWT tokens from cookies.
 * 
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * 
 * @returns {void} Responds with 401 if token is missing or invalid; otherwise, adds `user` to `req` and calls `next()`.
 */
const authMiddleware = ( req, res, next ) => {
    const token = req.cookies.access_token;

    if ( !token ) {
        return response(
            res,
            false,
            401,
            'No access token found'
        );
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    req.user = decoded;
    next();
};

export default authMiddleware;
