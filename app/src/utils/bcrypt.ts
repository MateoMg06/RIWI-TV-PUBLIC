import bcrypt from 'bcryptjs'

export function hashPassword(password: string, saltRounds: string){
    return bcrypt.hash(password, saltRounds)
}

export function comparePassword(rawPassword: string, hashedPassword: string){
    return bcrypt.compare(rawPassword, hashedPassword)
}