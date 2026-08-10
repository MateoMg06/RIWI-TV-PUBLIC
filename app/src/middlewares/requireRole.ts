import { Request, Response, NextFunction, RequestHandler } from "express"

export default function requireRole(...allowedRoles: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const user= req.user
        const userRole= user?.role
        if(!user){ 
            return res.status(401).json({error: 'Usuario no autenticado'})
        }

        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({error: 'Usuario no autorizado'})
        }
        next()
    }
}