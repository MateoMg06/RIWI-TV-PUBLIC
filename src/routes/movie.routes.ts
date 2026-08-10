// app/src/routes/movie.routes.ts

/**
 * Rutas de Película
 * -----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Movie`.
 *
 * Endpoints disponibles:
 *  - `POST /movies/` : Crear una nueva película.
 *  - `GET /movies/`  : Obtener todas las películas registradas.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { createMovie, getMovies, getOneMovie } from "../controllers/movie.controller";

import { Router } from 'express';

const MovieRouter = Router();

/**
 * POST /
 * -----
 * Crea un nueva película en la base de datos.
 * 
 * Request Body:
 *  - `name`: string (obligatorio)
 *  - `clasification`: string (obligatorio)
 *  - `duration`: number (obligatorio)
 *  - `genre`: string (obligatorio)
 * 
 * Response:
 *  - 201 Created: Retorna la película creada en formato JSON.
 *  - 500 Internal Server Error: En caso de error en la creación.
 * 
 * 
=======
>>>>>>> upstream/main
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crear un nueva película
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - clasification
 *               - duration
 *               - gener
 *              
 *             properties:
 *               name:
 *                 type: string
 *                 example: spider man
 *               clasification:
 *                 type: string
 *                 example: PG-13
 *               duration:
 *                 type: number
 *                 example: 120
 *               gener:
 *                 type: string
 *                 example: Action
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "spider man"
 *               clasification: "PG-13"
 *               duration: 120
 *               gener: "Action"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: La película ya existe
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: No se pudo crear la pelicula
 */
MovieRouter.post('/', createMovie);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtener todas las películas
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Lista de películas obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: spider man
 *                 clasification: PG-13
 *                 duration: 120
 *                 gener: Action
 *               - id: 2
 *                 name: batman
 *                 clasification: PG-13
 *                 duration: 130
 *                 gener: Action
 *                
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: Parámetros incorrectos
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: Error al obtener las películas
 */
MovieRouter.get('/', getMovies);

export default MovieRouter;