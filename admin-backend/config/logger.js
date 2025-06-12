import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors, json } = format;

const SERVICE_NAME = "admin-service";

/**
 * Configuration for console logging format using Winston
 * Combines multiple formatting options for log output
 *
 * @constant
 * @type {import('winston').Logform.Format}
 * @property {Function} colorize - Adds colors to log output
 * @property {Function} timestamp - Adds timestamp in YYYY-MM-DD HH:mm:ss format
 * @property {Function} errors - Handles error stack traces
 * @property {Function} printf - Custom formatter that outputs:
 *    - Timestamp
 *    - Log level
 *    - Service name
 *    - Message
 *    - Stack trace (if error)
 *    - Additional metadata as JSON string (if present)
 * @returns {string} Formatted log string
 */
const consoleFormat = combine(
    colorize( { all: true } ),
    timestamp( { format: "YYYY-MM-DD HH:mm:ss" } ),
    errors( { stack: true } ),
    printf( ( { timestamp, level, message, stack, ...meta } ) => {
        delete meta.service;

        return stack
            ? `[${ timestamp }] ${ level }: ${ SERVICE_NAME } - ${ message }\n${ stack }`
            : `[${ timestamp }] ${ level }: ${ SERVICE_NAME } - ${ message } ${
                Object.keys( meta ).length ? JSON.stringify( meta ) : ""
            }`;
    } )
);

const logger = createLogger( {
    level: "info",
    format: combine( timestamp(), errors( { stack: true } ), json() ),
    defaultMeta: { service: SERVICE_NAME },
    transports: [
        new transports.Console( {
            format: consoleFormat,
            stderrLevels: [ "error" ],
            handleExceptions: true,
        } ),
    ],
    exitOnError: false,
} );

export default logger;
