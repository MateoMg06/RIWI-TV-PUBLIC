// app/src/routes/movie.routes.ts

import { Router } from "express";
import movieController from "../controllers/movie.controller";

/**
 * Rutas de Películas
 * -------------------
 * Define los endpoints HTTP relacionados con la entidad Movie
 * y los conecta con sus respectivos métodos del controller.
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
 *                   clasification:
 *                     type: string
 *                     example: PG-13
 *                   duration:
 *                     type: integer
 *                     example: 120
 *                   gener:
 *                     type: string
 *                     example: Acción
 *       500:
 *         description: Error al obtener la cartelera
 */
router.get("/", movieController.getCatalog);

/**
 * @swagger
 * /api/movies/catalog/{cityId}:
 *   get:
 *     summary: Obtiene cartelera filtrada por ciudad (HU2)
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ciudad activa
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: integer
 *         description: Alternativo por query ?cityId=
 *     responses:
 *       200:
 *         description: Cartelera filtrada o mensaje sin funciones
 *       400:
 *         description: cityId inválido
 *       404:
 *         description: Ciudad no encontrada
 *       422:
 *         description: Ciudad inactiva
 */
router.get("/catalog/:cityId", movieController.getCatalogByCity);

router.get("/:id/cinemas", movieController.getMovieCinemas);

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
router.get("/:name", movieController.getByName);

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
router.post("/", movieController.create);

export default router;