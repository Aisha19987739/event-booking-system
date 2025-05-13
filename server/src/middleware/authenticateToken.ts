import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token =
    req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || !isValidPayload(decoded)) {
      res.status(403).json({ message: 'Invalid or expired token.' });
      return;
    }

    // تأكيد أن decoded يحتوي على userId و role
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  });
};

export default authenticateToken;
