import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app.error";
import logger from "../config/logger.config";
import { getRequestId } from "../utils/asyncContext.util";
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    
    // Check if it's our custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        // Handle other Error types
        message = err.message;
    }
    
    // Log the error details for debugging
    logger.error({
        message: err.message,
        statusCode,
        stack: err.stack
    });

    // Send the error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Only show stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    
    return; // Important: prevent further execution
};