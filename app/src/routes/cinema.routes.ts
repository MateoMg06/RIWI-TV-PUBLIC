/**
 * Rutas de Cines
 * ---------------
 * Este archivo define los endpoints HTTP relacionados con la entidad Cinema.
 *
 * Endpoints disponibles:
 *  - GET /api/cinemas/:id/movies : Obtener películas de un cine.
 *  - GET /api/cinemas/:id/showtimes : Obtener proyecciones de un cine con películas asociadas.
 *  - POST /api/cinemas : Crear un cine.
 *  - POST /api/cinemas/:id/movies/:movieId : Asignar una película a un cine.
 *  - DELETE /api/cinemas/:id/movies/:movieId : Quitar una película de un cine.
 */

import { Router } from 'express';
import {
  getCinemas,
  getCinemaMovies,
  createCinema,
  addMovieToCinema,
  removeMovieFromCinema,
  getShowtimes,
} from '../controllers/cinema.controller';

const router = Router();

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Obtener todos los cines activos
 *     tags:
 *       - Cinemas
 *     parameters:
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de la ciudad activa (opcional)
 *     responses:
 *       200:
 *         description: Lista de cines activos obtenida exitosamente
 *       400:
 *         description: cityId inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getCinemas);

/**
 * @swagger
 * /api/cinemas:
 *   post:
 *     summary: Crear un nuevo cine
 *     tags:
 *       - Cinemas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cityId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cinemark Centro
 *               cityId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cine creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Ciudad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createCinema);

/**
 * @swagger
 * /api/cinemas/{id}/movies:
 *   get:
 *     summary: Obtener películas de un cine
 *     tags:
 *       - Cinemas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cine
 *     responses:
 *       200:
 *         description: Lista de películas obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cine no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/movies', getCinemaMovies);

/**
 * @swagger
 * /api/cinemas/{id}/movies/{movieId}:
 *   post:
 *     summary: Asignar una película a un cine
 *     tags:
 *       - Cinemas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cine
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la película
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - horario
 *               - fecha
 *               - sala
 *               - precio
 *             properties:
 *               horario:
 *                 type: string
 *                 example: "19:30"
 *               fecha:
 *                 type: string
 *                 example: "2026-08-20"
 *               sala:
 *                 type: string
 *                 example: "A-5"
 *               precio:
 *                 type: number
 *                 example: 15.99
 *     responses:
 *       201:
 *         description: Proyección creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cine o película no encontrados
 *       409:
 *         description: La película ya está asignada a este cine
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:id/movies/:movieId', addMovieToCinema);

/**
 * @swagger
 * /api/cinemas/{id}/movies/{movieId}:
 *   delete:
 *     summary: Quitar una película de un cine
 *     tags:
 *       - Cinemas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cine
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Proyección eliminada exitosamente
 *       400:
 *         description: IDs inválidos
 *       404:
 *         description: Proyección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id/movies/:movieId', removeMovieFromCinema);

/**
 * @swagger
 * /api/cinemas/{id}/showtimes:
 *   get:
 *     summary: Obtener proyecciones de un cine
 *     tags:
 *       - Cinemas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cine
 *     responses:
 *       200:
 *         description: Lista de proyecciones obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cine no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/showtimes', getShowtimes);

export default router;
