/**
 * Rutas de Países
 * ---------------
 * Este archivo define los endpoints HTTP relacionados con la entidad Country.
 *
 * Endpoints disponibles:
 *  - GET /api/countries : Obtener todos los países.
 *  - GET /api/countries/:id/departments : Obtener departamentos de un país.
 *  - POST /api/countries : Crear un país.
 */

import { Router } from 'express';
import {
  getCountries,
  getCountryDepartments,
  createCountry,
} from '../controllers/country.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

const router = Router();

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Obtener todos los países
 *     tags:
 *       - Countries
 *     responses:
 *       200:
 *         description: Lista de países obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getCountries);

/**
 * @swagger
 * /api/countries/{id}/departments:
 *   get:
 *     summary: Obtener departamentos de un país
 *     tags:
 *       - Countries
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del país
 *     responses:
 *       200:
 *         description: Lista de departamentos obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: País no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/departments', getCountryDepartments);

/**
 * @swagger
 * /api/countries:
 *   post:
 *     summary: Crear un nuevo país
 *     tags:
 *       - Countries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *             properties:
 *               country:
 *                 type: string
 *                 example: Colombia
 *     responses:
 *       201:
 *         description: País creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authToken, requireRole("admin"), createCountry);

export default router;
