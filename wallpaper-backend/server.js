/**
 * Express server.
 * @module server
 */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';
import morganMiddleware from './config/morgan.js';
import { errorHandler } from './middleware/error-handler.js';
import testRouter from './routes/test.js';
import response from './template/response.js';

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();

// Configurations.
dotenv.config();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Morgan logging middleware
app.use(morganMiddleware);

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || 'http://localhost:';

// Routes.
const namespace = '/api/v1/test';
app.use(namespace, testRouter);

app.use((_, res) => {
    return response(
        res,
        false,
        404,
        '404 not found!'
    );
});

// Error Handler (Should be last).
app.use(errorHandler);

/**
 * Start the Express server on the specified port.
 * @listens {number} PORT - The port number the server is listening on
 */
app.listen(PORT)
    .on('error', (error) => {
        logger.error(error.message);
        process.exit(1);
    })
    .on('listening', async () => {
        try {
            await connectDB();
            logger.info(`Service is running on port: ${PORT}`);
            logger.info(`Base URL: ${BASE_URL + PORT}`);
        } catch (error) {
            logger.error(`Failed to connect to DB: "${error.message || error}"`);
            process.exit(1);
        }
    });