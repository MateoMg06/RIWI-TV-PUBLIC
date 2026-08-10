import { Request, Response, NextFunction, RequestHandler } from 'express';

export default function requireRole(...allowedRoles: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        const userRole = typeof user === 'object' && user !== null && 'role' in user ? user.role : undefined;

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Usuario no autorizado' });
        }

        next();
    };
}