export async function validatePassword(password: string): Promise<boolean>{ 
    const hasMinLength= password.length >= 10
    const hasDigit= /[0-9]/.test(password)
    const hasLowercase= /\p{Ll}/u.test(password)
    const hasUppercase= /\p{Lu}/u.test(password)
    const hasSpecialChar = /[\p{P}\p{S}]/u.test(password)

    return hasMinLength && hasDigit && hasLowercase && hasUppercase && hasSpecialChar
}