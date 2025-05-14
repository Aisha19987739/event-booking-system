// types/express/index.d.ts أو أي ملف types عام
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
