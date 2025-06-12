/**
 * Morgan logging configuration
 * @module morgan
 */

import morgan from 'morgan';

import logger from './logger.js';

const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

/**
 * Morgan middleware configuration
 * Integrates with existing logger system
 */
const morganMiddleware = morgan( morganFormat, {
    stream: {
        write: ( message ) => {
            logger.info( message.trim() );
        }
    }
} );

export default morganMiddleware;
