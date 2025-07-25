import { NextFunction, Request , Response } from "express";
import { FileNotFoundError, InternalServerError } from "../utils/errors/app.error";

export const pingController = (req : Request, res: Response , next : NextFunction) : void => {
    setTimeout(()=>{
        next(new FileNotFoundError('File not found')); // Pass an error to the next middleware
    },4000); // Simulate a delay of 1 second


    // synchronous error can be handled by error handler easily but for asynchronous errors, we need to pass the error to next()
    // This code will not execute if next() is called with an error
}