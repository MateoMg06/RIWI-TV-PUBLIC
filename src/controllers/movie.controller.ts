import { Request, Response } from 'express';

import movieService from '../services/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';

/**
 * ============================================================================
 * Controlador de Películas
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `Movie`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `MovieService`.
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
 * MovieController
 *      │
 * MovieService
 *      │
 * MovieRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Crea una nueva pelicula.
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
 *   "name": "spider man",
 *   "clasification": "PG-13",
 *   "duration": 120,
 *   "genre": "Action"
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
 *   Película creada correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 *
 * @throws {Error}
 * Cualquier excepción generada por la capa de servicios será capturada
 * y retornada como una respuesta HTTP con código 500.
 */
export const createMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Construcción del DTO recibido desde el cliente.
    const dto: CreateMovieDto = req.body;

    // Delega la lógica de negocio al servicio.
    const movie = await movieService.create(dto);

    // Retorna el recurso creado.
    return res.status(201).json(movie);
  } catch (error: any) {
    return res.status(401).json({
      error: error.message,
    });
  }
};

/**
 * Obtiene el listado completo de películas.
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
 *   Lista de películas obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *   {
 *     "id": 1,
 *     "name": "spider man",
 *     "clasification": "PG-13",
 *     "duration": 120,
 *     "genre": "Action"
 *   }
 * ]
 */
export const getMovies = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Solicita la información al servicio.
    const movies = await movieService.findAll();

    // Retorna la colección de películas.
    return res.status(200).json(movies);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getOneMovie = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {name}  = _req.body;
    console.log(name); 
    // Solicita la información al servicio.
    const movies = await movieService.findOne(name);

        // Retorna la colección de películas.
        return res.status(200).json(movies);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};