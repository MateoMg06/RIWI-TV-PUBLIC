import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload } from '../types/index.d';
import userRepository from '../repositories/user.repository';

export async function authToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = req.cookies?.accessToken || bearer;

  if (!token) {
    res.status(401).json({ message: 'Usuario sin token' });
    return;
  }

  try {
    const data = jwt.verify(token, String(process.env.JWT_SECRET)) as AuthPayload;
    const user = await userRepository.findByID(data.id);
    if (!user || user.accountStatus !== 'active' || user.accessToken !== token) {
      res.status(401).json({ message: 'Sesión inválida o cerrada' });
      return;
    }
    req.user = data;
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}
