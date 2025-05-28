// src/types/express.d.ts

import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { File } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
        file?: File;// أو يمكن أن تكون 'user' من نوع 'JwtPayload' أو 'string'
    }
  }
}


