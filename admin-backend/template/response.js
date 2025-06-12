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
 * @param {Array<{key: string, value: string, options: object}>} [cookies] - Optional array of cookies to be set
 * @returns {object} Express response object with formatted JSON
 *
 * @description
 * This function creates a standardized response format for all API endpoints.
 * Only the 'success' property is always included. The 'message' and 'data'
 * properties are only added to the response when provided (non-null/undefined).
 * Cookies can be set by providing an array of cookie objects.
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
 * // Response with cookies
 * response(res, true, 200, "Login successful", null, [{ key: "token", value: "abc123", options: { httpOnly: true } }]);
 * // Sets cookie and returns: { "success": true, "message": "Login successful" }
 */
export default function response( res, success = true, statusCode = 200, message, data, cookies ) {
    const result = { success, };

    if ( message ) result.message = message;
    if ( data ) result.data = data;

    if ( cookies ) {
        cookies.forEach( ( { key, value, options } ) => {
            res.cookie( key, value, options );
        } );
    }

    return res.status( statusCode ).json( result );
}
