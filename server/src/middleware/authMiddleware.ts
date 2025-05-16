// src/middleware/authenticateToken.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ExtendedJwtPayload } from '../types/jwt';  // استيراد النوع المخصص
import { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/AuthenticatedRequest';

dotenv.config();

// Type Guard للتحقق من وجود الخصائص في الـ decoded
function isValidPayload(decoded: any): decoded is ExtendedJwtPayload {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    'role' in decoded
  );
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
     res.status(401).json({ message: 'Access token missing' });
      return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !('userId' in decoded) || !('role' in decoded)) {
       res.status(403).json({ message: 'Invalid token' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  });
};

// src/middleware/authMiddleware.ts




// src/middleware/authMiddleware.ts




 export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload & { role?: string };

    if (!user || !roles.includes(user.role || '')) {
       res.status(403).json({ message: 'Access denied: insufficient role' });
       return
    }

    next();
  };
};

export default authenticateToken ;

