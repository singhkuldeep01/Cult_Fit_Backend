import winston from "winston";
import { getRequestId } from "../utils/asyncContext.util";
import 'winston-daily-rotate-file';

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
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log', // Log file name with date
            datePattern: 'YYYY-MM-DD-HH', // Date pattern for log files
            zippedArchive: true, // Enable gzip compression for log files
            maxSize: '20m', // Maximum size of a log file
            maxFiles: '14d' // file will be kept for 14 days
        }),
    ]
});


export default logger;