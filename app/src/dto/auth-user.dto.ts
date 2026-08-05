// app/src/dto/create-user.dto.ts

/**
 * DTO - Autenticación de Usuario
 * -------------------------
 * Este DTO representa la información necesaria para crear un nuevo usuario.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de usuarios.
 *
 * @property {string} email - Dirección de correo electrónico única del usuario.
 * @property {string} password - Contraseña
 * @property {string} role - Rol
 * @example
 * const dto: AuthUserDto = {
 *   email: "david@example.com"
 *   password: '1234'
 * };
 */

export interface AuthUserDto {


    /**
     * Correo electrónico del usuario.
     */
    email: string;

    /**
     * Contraseña del usuario.
     */
    password: string;

    /**
     * Contraseña del usuario.
     */
    rol: string;
}

