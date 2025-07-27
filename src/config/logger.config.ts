import winston from "winston";
import { getRequestId } from "../utils/asyncContext.util";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.json(),
        winston.format.printf((info) => {
            const requestId = getRequestId(); // Get the request ID from async context
            const output = {
                requestId: requestId, // Include the unique ID if available
                timestamp: info.timestamp,
                level: info.level,
                message: info.message,
            }
            // JSON.stringify(value, replacer, space)
            // - replacer (null): No custom transformation of values
            // - space (2): Indent with 2 spaces for pretty formatting
            return JSON.stringify(output, null, 2);
        })
    ),
    transports: [
        new winston.transports.Console({
            // format: winston.format.combine(
            //     winston.format.colorize(),
            //     winston.format.simple()
            // )
        }),
        new winston.transports.File({ 
            filename: 'logs/error.json', 
            level: 'error',
            format: winston.format.json()
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.json',
            format: winston.format.json()
        })
    ]
});


export default logger;