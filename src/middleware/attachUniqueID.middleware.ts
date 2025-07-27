import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage } from '../utils/asyncContext.util';


export const attachUniqueID = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = uuidv4();
    
    // Store in async context - this creates a unique context per request
    asyncLocalStorage.run({ requestId }, () => {
        next();
    });
};