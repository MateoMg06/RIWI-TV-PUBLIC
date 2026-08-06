import jwt, { JwtPayload } from "jsonwebtoken";

export function createToken(payload: JwtPayload, jwtSecret: string, expiresIn: object): string{
    return jwt.sign(payload, jwtSecret, {
        expiresIn: "0" //Valor por defecto para evitar error, se sobreescribe al crear el token
    })
}

export function verifyToken(refreshToken: string, jwtRefresh: string): string | JwtPayload{
    return jwt.verify(refreshToken, jwtRefresh)
}