import { raw, Request, Response } from 'express';
import userService from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { createToken, verifyToken } from '../utils/jwt';
import { cookieOptions } from '../config/cookie';
import { JwtPayload } from 'jsonwebtoken';

/**
 * ============================================================================
 * Controlador de Usuarios
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `User`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `UserService`.
 *
 * Responsabilidades:
 *  - Recibir y procesar las solicitudes HTTP.
 *  - Obtener la información enviada por el cliente.
 *  - Invocar el servicio correspondiente.
 *  - Construir la respuesta HTTP.
 *  - Retornar los códigos de estado apropiados.
 *
 * Este controlador NO debe:
 *  - Contener reglas de negocio.
 *  - Acceder directamente a la base de datos.
 *  - Ejecutar consultas mediante Sequelize.
 *  - Realizar validaciones complejas del dominio.
 *
 * Arquitectura:
 *
 * Cliente HTTP
 *      │
 * UserController
 *      │
 * UserService
 *      │
 * UserRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Crea un nuevo usuario.
 *
 * Recibe la información enviada por el cliente, construye el DTO de creación
 * y delega la operación al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 * {
 *   "name": "David Mtz",
 *   "email": "david@example.com"
 * }
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **201 Created**
 *   Usuario creado correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 *
 * @throws {Error}
 * Cualquier excepción generada por la capa de servicios será capturada
 * y retornada como una respuesta HTTP con código 500.
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Construcción del DTO recibido desde el cliente.
    const dto: CreateUserDto = req.body;

    // Delega la lógica de negocio al servicio.
    const user = await userService.create(dto);

    // Retorna el recurso creado.
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(401).json({
      error: error.message,
    });
  }
};

/**
 * Obtiene el listado completo de usuarios.
 *
 * Delega la consulta a la capa de servicios, la cual será responsable de
 * aplicar cualquier regla de negocio antes de consultar el repositorio.
 *
 * @async
 *
 * @param {Request} _req
 * Objeto de la petición HTTP.
 *
 * En este endpoint no se utiliza, por ello se antepone "_" al nombre de la
 * variable para indicar explícitamente que el parámetro es requerido por
 * Express pero no será utilizado.
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Lista de usuarios obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "name": "David",
 *     "email": "david@example.com"
 *   }
 * ]
 */
export const getUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Solicita la información al servicio.
    const users = await userService.findAll();

    // Retorna la colección de usuarios.
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getOneUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {email,password}  = _req.body;
    console.log(email); 
    // Solicita la información al servicio.
    const users = await userService.findCredential(email,password);
    
        // Retorna la colección de usuarios.
        return res.status(200).json(users);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

export const login = async (_req: Request, res: Response): Promise<Response> => {

    const {email, password, role}  = _req.body;
    if (!email || !password) { // Validar que se proporcionen tanto el correo del usuario como su contraseña
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    try {
        const validUser= await userService.findCredential(email, password)
        if(!validUser){
          return res.status(401).json({error: "Unauthorized access due to any invalid credential"})
        }
        const payload= {
          email: email,
          role: role
        }
        const accessToken= createToken(
          payload,
          String(process.env.JWT_SECRET),
          {expiresIn: "1h"}
        )
        const refreshToken= createToken(
          payload,
          String(process.env.JWT_REFRESH_SECRET),
          {expiresIn: "7d"}
        )
        return res
          .status(201)
          .cookie("accessToken", accessToken, cookieOptions)
          .json({
            message: "Login exitoso",
            accessToken,
            refreshToken,
            user: {
              email: payload.email,
              role: payload.role
            }
          })

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

export const refresh = async (_req: Request, res: Response): Promise<Response> => {

    try {
        const {refreshToken}  = _req.body;
        if(!refreshToken){
          return res.status(401).json({error: "Usuario sin token"})
        }
        const payload= verifyToken(refreshToken, String(process.env.JWT_REFRESH_SECRET)) as JwtPayload
        
        if(!payload){
          return res.status(401).json({error: "Token inválido"})
        }

        const newToken= createToken(
          {
            email: payload.email,
            role: payload.role
          },
          String(process.env.JWT_SECRET),
          {expiresIn: "1h"}
        )
        return res
          .status(201)
          .cookie("accessToken", newToken, cookieOptions)
          .json({newToken: newToken})

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

export const logout= async (_req: Request, res: Response): Promise<Response> => {

    try {

        return res
          .status(200)
          .clearCookie("accessToken", cookieOptions)
          .json({message: "Sesión cerrada correctamente"})

    } catch (error: any) {

        return res.status(500).json({
              error: error.message
          });

    }
}