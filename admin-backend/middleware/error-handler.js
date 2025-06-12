import response from '../template/response.js';
import logger from '../config/logger.js';

/**
 * Global error handler middleware
 */
const errorHandler = ( err, _req, res, _next ) => {
    logger.error( err );
    let message = 'Something went wrong!';
    let statusCode = 500;

    // Mongoose validation error
    if ( err.name === 'ValidationError' ) {
        statusCode = 400;
        const messages = Object.values( err.errors ).map( err => err.message );
        
        if ( messages.length > 0 ) {
            message = messages[ 0 ];
        }
    }

    // Mongoose duplicate key error
    if ( err.code === 11000 ) {
        statusCode = 400;
        message = `Duplicate value entered for ${ Object.keys(
            err.keyValue
        ) } field, please use another value`;
    }

    // Mongoose cast error (invalid ID)
    if ( err.name === 'CastError' && err.kind === 'ObjectId' ) {
        statusCode = 400;
        message = "Invalid ID!";
    }

    // Authentication JWT error
    if ( err.name === 'JsonWebTokenError' ) {
        statusCode = 401;
        message = 'Invalid token or token expired, authorization denied';
    }

    // Authentication token expired error
    if ( err.name === 'TokenExpiredError' ) {
        statusCode = 401;
        message = 'Token expired, please login again';
    }

    const { statusCode: customStatusCode, message: customMessage } = err;
    
    // Custom defined errors
    if ( customStatusCode ) {
        statusCode = customStatusCode;
        message = customMessage;
    }

    return response(
        res,
        false,
        statusCode,
        message
    );
};

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = ( fn ) => ( req, res, next ) =>
    Promise.resolve( fn( req, res, next ) ).catch( next );

export {
    asyncHandler, errorHandler
};
