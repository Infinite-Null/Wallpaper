/**
 * test routes module
 * Handles all test-related API endpoints
 * @module routes/test
 */
import express from 'express';

import { testController } from '../controller/test.js';

/**
 * Express router instance for routes
 * @type {express.Router}
 */
const testRoute = express.Router();

/**
 * Test endpoint for test functionality
 * @route POST /hello
 * @access Public
 * @description Test route for test operations
 */
testRoute.post('/hello', testController);

export default testRoute;