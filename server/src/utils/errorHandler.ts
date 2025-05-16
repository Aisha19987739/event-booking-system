import { Response } from 'express';

export const handleError = (
  res: Response,
  error: unknown,
  customMessage = 'Server error',
  statusCode = 500
): void => {
  console.error('❌ Error:', error);
  res.status(statusCode).json({
    message: customMessage,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  });
};
