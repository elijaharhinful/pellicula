import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

/**
 * JWT Authentication Middleware
 * Validates JWT tokens and attaches user information to request object
 * Expected Authorization header format: "Bearer <token>"
 * 
 * @param req - Extended request object that will contain user data after authentication
 * @param res - Express response object
 * @param next - Express next function to continue to next middleware/route handler
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Extract Authorization header from request
  const authHeader = req.get('authorization');
  
  // Extract token from "Bearer <token>" format
  // Split by space and take the second part (index 1)
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  // Verify the JWT token using the secret from environment variables
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      // Token is invalid, expired, or malformed
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    // Token is valid - attach decoded user information to request object
    // This makes user data available in subsequent route handlers
    req.user = decoded;
    
    // Continue to next middleware or route handler
    next();
  });
};