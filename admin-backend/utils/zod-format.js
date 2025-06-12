/**
 * Formats Zod validation errors into a simplified array of error objects
 * @param {import('zod').ZodError} zodError - The Zod error object to format
 * @returns {Array<{code: string, path: string|Array<string>, message: string}>} Array of formatted error objects
 * - code: The Zod error code
 * - path: The path to the field with error (string if single level, array if nested)
 * - message: The error message
 */
export function formatZodErrors( zodError ) {
    if ( !zodError?.issues ) return [];

    return zodError.issues.map( ( issue ) => ( {
        code: issue.code,
        path: issue.path.length === 1 ? issue.path[ 0 ] : issue.path,
        message: issue.message,
    } ) );
}
