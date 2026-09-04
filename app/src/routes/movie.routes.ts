// app/src/routes/movie.routes.ts

import { Router } from "express";
import {
  create,
  getCatalog,
  getByName,
  getMovieCinemas,
  getWeeklyMovies,
  getTodayMovies,
  getFilteredMovies,
} from "../controllers/movie.controller";
import { authToken } from "../middlewares/authToken";
import requireRole from "../middlewares/requireRole";

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
router.get("/", authToken, requireRole("admin", "usuario"), getCatalog);

/**
 * @swagger
 * /api/movies/weekly:
 *   get:
 *     summary: Obtiene las películas que estrenan durante la semana
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de películas de la semana
 *       500:
 *         description: Error al obtener las películas de la semana
 */
router.get("/weekly", authToken, requireRole("admin", "usuario"), getWeeklyMovies);

/**
 * @swagger
 * /api/movies/today:
 *   get:
 *     summary: Obtiene las películas que estrenan hoy
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de películas de hoy
 *       500:
 *         description: Error al obtener las películas de hoy
 */
router.get("/today", authToken, requireRole("admin", "usuario"), getTodayMovies);

/**
 * @swagger
 * /api/movies/filter:
 *   get:
 *     summary: Obtiene las películas aplicando filtros
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Género de la película
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Estado de la película (activa/inactiva)
 *     responses:
 *       200:
 *         description: Lista de películas filtradas
 *       500:
 *         description: Error al filtrar las películas
 */
router.get("/filter", authToken, requireRole("admin", "usuario"), getFilteredMovies);

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
router.get("/weeklyMovies", authToken, requireRole("admin", "usuario"), getWeeklyMovies);

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
router.get("/:id/cinemas", authToken, requireRole("admin", "usuario"), getMovieCinemas);

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
router.get("/:name", authToken, requireRole("admin", "usuario"), getByName);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crea una nueva película
 *     tags: [Movies]
 *     security:
 *       - cookieAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spiderman
 *               clasification:
 *                 type: string
 *                 example: PG-13
 *               duration:
 *                 type: integer
 *                 example: 120
 *               gener:
 *                 type: string
 *                 example: Acción
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *       500:
 *         description: Error al crear la película
 */
router.post("/", authToken, requireRole("admin"), create);

export default router;
