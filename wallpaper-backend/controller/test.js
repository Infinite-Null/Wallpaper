/**
 * test controller module
 * Contains all test-related controller functions
 * @module controller/test
 */
import { asyncHandler } from '../middleware/error-handler.js';

/**
 * Test controller for test functionality
 * @route POST /api/v1/test/hello
 * @access Public
 * @description Test endpoint that returns a hello message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with hello message
 */
const testController = asyncHandler((req, res) => {
    res.status(200).json({
        message: 'Hello World! Your API is working correctly.'
    });
});

export { testController };