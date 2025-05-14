import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// type guard
function isValidPayload(
  decoded: any
): decoded is jwt.JwtPayload & { userId: string; role: string } {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    'role' in decoded
  );
}


export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || typeof decoded === 'string' || !decoded) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    req.user = {
      ...decoded,
      userId: (decoded as JwtPayload).userId,
      role: (decoded as JwtPayload).role,
    };

    next();
  });
};

export default authenticateToken;
