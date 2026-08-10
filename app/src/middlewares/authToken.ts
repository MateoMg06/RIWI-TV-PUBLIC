import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export default function authToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
        res.status(401).json({ message: 'Usuario sin token' });
        return;
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
}