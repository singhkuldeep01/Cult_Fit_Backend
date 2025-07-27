import { NextFunction, Request , Response } from "express";
import { FileNotFoundError, InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";
import { getRequestId } from "../utils/asyncContext.util";
export const pingController = (req : Request, res: Response , next : NextFunction) : void => {
    // Get request ID from AsyncLocalStorage
    logger.info('Ping request received'); // Log the ping request with UUID
    setTimeout(()=>{
        // Even in async operations like setTimeout, the same request ID will be available
        logger.error('Error in async operation', { requestId: getRequestId() });
        next(new FileNotFoundError('File not found')); // Pass an error to the next middleware
    },10); // Simulate a delay of 1 second


    // synchronous error can be handled by error handler easily but for asynchronous errors, we need to pass the error to next()
    // This code will not execute if next() is called with an error
};