/**
 * Utility function to send standardized JSON responses
 *
 * @module template/response
 *
 * @param {object} res - Express response object (REQUIRED)
 * @param {boolean} [success=true] - Indicates if the request was successful
 * @param {number} [statusCode=200] - HTTP status code for the response
 * @param {string} [message] - Optional response message to be sent to the client
 * @param {*} [data] - Optional data to be included in the response
 * @returns {object} Express response object with formatted JSON
 *
 * @description
 * This function creates a standardized response format for all API endpoints.
 * Only the 'success' property is always included. The 'message' and 'data'
 * properties are only added to the response when provided (non-null/undefined).
 *
 * @example
 * // Success response with message and data
 * response(res, true, 200, "User created successfully", { userId: "123" });
 * // Returns: { "success": true, "message": "User created successfully", "data": { "userId": "123" } }
 *
 * @example
 * // Error response with only message
 * response(res, false, 400, "Invalid input parameters");
 * // Returns: { "success": false, "message": "Invalid input parameters" }
 *
 * @example
 * // Minimal response with only success flag
 * response(res);
 * // Returns: { "success": true }
 */
export default function response(res, success = true, statusCode = 200, message, data) {
    const result = { success };

    if (message) result.message = message;
    if (data) result.data = data;

    return res.status(statusCode).json(result);
}