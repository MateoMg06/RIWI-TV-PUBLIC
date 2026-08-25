// app/src/routes/movie.routes.ts

import { Router } from "express";
import {
  create,
  getCatalog,
  getByName,
  getMovieCinemas,
  getWeeklyMovies
} from "../controllers/movie.controller";

/**
 * Rutas de Películas
 */
const router = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtiene la cartelera completa de películas
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de películas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Spiderman
 *                   classification:
 *                     type: string
 *                     example: PG-13
 *                   duration:
 *                     type: integer
 *                     example: 120
 *                   genre:
 *                     type: string
 *                     example: Acción
 *       500:
 *         description: Error al obtener la cartelera
 */
router.get("/", getCatalog);

/**
 * @swagger
 * /api/movies/weeklyMovies:
 *   get:
 *     summary: Obtiene las películas de la semana
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de películas de la semana
 *       500:
 *         description: Error al obtener las películas de la semana
 */
router.get("/weeklyMovies", getWeeklyMovies);

/**
 * @swagger
 * /api/movies/{id}/cinemas:
 *   get:
 *     summary: Obtiene los cines donde se proyecta una película
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Lista de cines donde se proyecta la película
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Película no encontrada
 */
router.get("/:id/cinemas", getMovieCinemas);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crea una nueva película
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - synopsis
 *               - classification
 *               - duration
 *               - genre
 *               - director
 *               - cast
 *               - poster_url
 *               - banner_url
 *               - trailer_url
 *               - release_date
 *               - status
 *               - audience_rating
 *               - createdAt
 *               - updatedAt
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spiderman
 *               synopsis:
 *                 type: string
 *                 example: Un superhéroe arácnido lucha contra el crimen en Nueva York.
 *               classification:
 *                 type: string
 *                 example: PG-13
 *               duration:
 *                 type: integer
 *                 example: 120
 *               genre:
 *                 type: string
 *                 example: Acción
 *               director:
 *                 type: string
 *                 example: Sam Raimi
 *               cast:
 *                 type: string
 *                 example: Tobey Maguire, Kirsten Dunst, Willem Dafoe
 *               poster_url:
 *                 type: string
 *                 example: https://example.com/poster.jpg
 *               banner_url:
 *                 type: string
 *                 example: https://example.com/banner.jpg
 *               trailer_url:
 *                 type: string
 *                 example: https://example.com/trailer.mp4
 *               release_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2002-05-03T00:00:00.000Z
 *               status:
 *                 type: boolean
 *                 example: true
 *               audience_rating:
 *                 type: number
 *                 format: float
 *                 example: 8.5
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-25T10:00:00.000Z
 *               updatedAt:
 *                 type: string
 *                 format: date-time 
 *                 example: 2026-08-25T10:00:00.000Z
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *       500:
 *         description: Error al crear la película
 */
router.post("/", create);

/**
 * @swagger
 * /api/movies/{name}:
 *   get:
 *     summary: Obtiene una película por nombre
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la película
 *     responses:
 *       200:
 *         description: Película encontrada
 *       404:
 *         description: Película no encontrada
 */
router.get("/:name", getByName);

export default router;
