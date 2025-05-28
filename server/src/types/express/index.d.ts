import { JwtPayload } from 'jsonwebtoken';

interface JwtUserPayload extends JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload; 
      
    }
  }
}

interface MulterRequest extends Request {
  file?: Express.Multer.File; // Multer يوفر نوع File ضمن Express.Multer
}


