import { Request, Response, NextFunction, RequestHandler } from "express"

export default function requireRole(...allowedRoles: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const user= req.user
        const userRole= user?.role
        if(!user){ 
            res.status(401).json({error: 'Usuario no autenticado'})
            return
        }

        if(!allowedRoles.includes(userRole)){
            res.status(401).json({error: 'Usuario no autorizado'})
            return
        }
        next()
    }
}