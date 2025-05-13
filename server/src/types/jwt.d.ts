// src/types/jwt.d.ts

import { JwtPayload } from 'jsonwebtoken';

export interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}
