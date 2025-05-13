// src/types/express.d.ts

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string; // أو يمكن أن تكون 'user' من نوع 'JwtPayload' أو 'string'
    }
  }
}
