const isProd: boolean= process.env.NODE_ENV=== "production"

export const cookieOptions: object= {
    httpOnly: true, // Cookie solo accesible por medio de peticiones HTTP, no JS
    secure: isProd, // Si está en producción, solo es accesible por HTTPS
    samesite: isProd ? "none" : "lax", // En producción se puede transportar entre diferentes dominios, sino, se limita al mismo (development)
    maxAge: 60 * 60 * 1000 // 1 hora en milisegundos
}
