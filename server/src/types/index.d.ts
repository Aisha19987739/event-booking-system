import { JwtPayload } from 'jsonwebtoken';

import { Request } from "express";
import { File } from "multer";


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { userId: string; role: string };
       file?: File;
    
    }
  }
}

// interface MulterRequest extends Request {
//   file: Express.Multer.File;
// }


