/**
 * Rutas de Ciudades
 * ------------------
 * Este archivo define los endpoints HTTP relacionados con la entidad City.
 *
 * Endpoints disponibles:
 *  - GET /api/cities/:id/cinemas : Obtener cines de una ciudad.
 *  - POST /api/departments/:departmentId/cities : Crear una ciudad.
 */

import { Router } from 'express';
import {
  getCityCinemas,
  getCitiesByDepartment,
  createCity,
} from '../controllers/city.controller';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/cities/{id}/cinemas:
 *   get:
 *     summary: Obtener cines de una ciudad
 *     tags:
 *       - Cities
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la ciudad
 *     responses:
 *       200:
 *         description: Lista de cines obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Ciudad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/cinemas', getCityCinemas);

/**
 * @swagger
 * /api/cities/{departmentId}:
 *   get:
 *     summary: Obtener ciudades de un departamento (HU2 - solo activas)
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Lista de ciudades activas obtenida exitosamente
 *       400:
 *         description: departmentId inválido
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:departmentId', getCitiesByDepartment);

/**
 * @swagger
 * /api/departments/{departmentId}/cities:
 *   post:
 *     summary: Crear una nueva ciudad
 *     tags:
 *       - Cities
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *             properties:
 *               city:
 *                 type: string
 *                 example: Bogotá
 *     responses:
 *       201:
 *         description: Ciudad creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createCity);

export default router;
