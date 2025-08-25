import jwt, { JwtPayload as JwtLibPayload } from 'jsonwebtoken';

// Environment configuration for JWT
// JWT_SECRET: Secret key for signing tokens (should be set in .env file)
// Fallback to 'jwtPassword' for development (NOT recommended for production)
const JWT_SECRET = process.env.JWT_SECRET || 'jwtPassword';

export interface JwtPayload extends JwtLibPayload {
  user_id: number;
  email: string;
  name: string;
  roles: Number[];
}

export class TokenUtil {
  /**
   * Generate a JWT token
   * Creates a signed JWT token with user information
   * Token expires in 1 hour by default
   */
  static generateToken(payload: JwtPayload): string {
    try {
        // Sign the payload with JWT_SECRET and set expiration time
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // or '7d', etc.
        return token;
        } catch (error) {
            throw new Error('Failed to generate token');
        }
    }

  /**
   * Verify and decode a JWT token
   * Validates token signature and expiration using JWT_SECRET
   * Returns decoded payload if valid, throws error if invalid/expired
   */
  static verifyToken(token: string): JwtPayload {
    try {
      // Verify token using the same secret used for signing
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      // Handle specific JWT errors for better error messaging
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Get token from Authorization header
   * Extracts JWT token from "Bearer <token>" format
   * Returns null if header is missing or malformed
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    // Split "Bearer <token>" and return the token part
    return authHeader?.split(' ')[1] || null;
  }
}
