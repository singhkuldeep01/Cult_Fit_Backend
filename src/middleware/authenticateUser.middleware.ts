import { Request, Response, NextFunction } from 'express';
import { TokenUtil } from '../utils/jwtToken.util';

// Middleware to authenticate user based on JWT token

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = TokenUtil.extractTokenFromHeader(req.headers.authorization);
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Authentication token is missing',
        });
        return;
    }
    try{
        const decoded = TokenUtil.verifyToken(token);
        req.body = {
            ...req.body,
            user_id: decoded.user_id,
            email: decoded.email,
            name: decoded.name,
            roles: decoded.roles
        };
        next();
    } catch (error : any) {
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid authentication token',
        });
    }
};
