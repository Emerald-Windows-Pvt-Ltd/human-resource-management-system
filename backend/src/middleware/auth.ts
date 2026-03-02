import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, User } from '../types';
import { UserModel } from '../models/User';
import { sendError } from '../utils/responseHelper';
import config from '../config';

// Generate JWT token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.secret as string, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, config.jwt.secret as string);
};

// Authentication middleware
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      sendError(res, 'Access token is required', 401);
      return;
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      sendError(res, 'Access token is required', 401);
      return;
    }

    const decoded = verifyToken(token) as JwtPayload;
    const user = await UserModel.getById(decoded.userId);
    
    if (!user || !user.isActive) {
      sendError(res, 'User not found or inactive', 401);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

// Authorization middleware - check user roles
export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize(['admin']);

// HR and Admin middleware
export const hrOrAdmin = authorize(['hr', 'admin']);

// All authenticated users middleware
export const authenticated = authenticate;