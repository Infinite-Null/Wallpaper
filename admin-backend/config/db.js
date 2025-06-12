/**
 * MongoDB connection module
 * @module db
 */

import mongoose from 'mongoose';

import logger from './logger.js';

/**
 * Connects to a MongoDB database using Mongoose.
 *
 * Attempts to establish a connection using the `DATABASE_URL` environment variable.
 *
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 * @throws {Error} If the `DATABASE_URL` environment variable is missing or if the connection attempt fails.
 */
async function connectDB() {
    if ( !process.env.DATABASE_URL ) {
        throw Error( 'Please provide Database URI' );
    }

    await mongoose.connect( process.env.DATABASE_URL );
    logger.info( 'Database connected successfully' );
}

export { connectDB };
