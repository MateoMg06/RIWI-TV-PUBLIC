import jwt, { JwtPayload } from "jsonwebtoken";

export function createToken(payload: JwtPayload, jwtSecret: string, expiresIn: object){
    return jwt.sign(payload, jwtSecret, {
        expiresIn: "0"
    })
}