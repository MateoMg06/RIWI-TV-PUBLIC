import jwt from 'jsonwebtoken'
import type {Request, Response, NextFunction} from 'express'

export async function authToken(req: Request, res: Response, next: NextFunction): Promise<void>{
    const token= req.cookies?.accessToken
    if(!token) {
        res.status(404).json({message: "Usuario sin token"})
        return
    }
    try{
        const data= jwt.verify(token, process.env.JWT_SECRET as string)
        req.user= data
        next()
    }
    catch(e){
        res.status(401).json({message: "Token inválido"})
        return
    }
}