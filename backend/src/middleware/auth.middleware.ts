import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For development, allow requests without auth
      if (process.env.NODE_ENV !== 'production') {
        req.user = {
          userId: 'user-001',
          email: 'developer@example.com',
          role: 'developer'
        };
        return next();
      }
      
      throw new AppError('缺少认证token', 401, 'UNAUTHORIZED');
    }
    
    const token = authHeader.substring(7);
    
    // For development, accept the fake token
    if (process.env.NODE_ENV !== 'production' && token.includes('fake-jwt-token')) {
      req.user = {
        userId: 'user-001',
        email: 'developer@example.com',
        role: 'developer'
      };
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as JwtPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('无效的认证token', 401, 'INVALID_TOKEN'));
    } else {
      next(error);
    }
  }
};

// Optional auth middleware - doesn't require auth but parses token if present
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as JwtPayload;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Ignore token errors in optional auth
    logger.warn('Optional auth token error:', error);
    next();
  }
};