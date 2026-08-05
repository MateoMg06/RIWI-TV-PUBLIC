import jwt, { JwtPayload } from "jsonwebtoken";

export function createAccessToken(payload: JwtPayload){
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
    })
}

export function createRefreshToken(payload: JwtPayload){
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })
}