import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { userId: string; role: string }; // نضيف userId و role إلى JwtPayload
    }
  }
}
