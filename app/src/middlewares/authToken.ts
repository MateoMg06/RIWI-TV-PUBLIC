import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export async function authToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: 'Usuario sin token' });
    return;
  }

  try {
    const data = jwt.verify(token, String(process.env.JWT_SECRET));
    req.user = data as any;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}