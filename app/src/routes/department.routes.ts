/**
 * Rutas de Departamentos
 * ----------------------
 * Este archivo define los endpoints HTTP relacionados con la entidad Department.
 *
 * Endpoints disponibles:
 *  - GET /api/departments/:id/cities : Obtener ciudades de un departamento.
 *  - POST /api/countries/:countryId/departments : Crear un departamento.
 */

import { Router } from 'express';
import {
  getDepartmentCities,
  createDepartment,
} from '../controllers/department.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/departments/{id}/cities:
 *   get:
 *     summary: Obtener ciudades de un departamento
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Lista de ciudades obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/cities', getDepartmentCities);

/**
 * @swagger
 * /api/countries/{countryId}/departments:
 *   post:
 *     summary: Crear un nuevo departamento
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: countryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del país
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - department
 *             properties:
 *               department:
 *                 type: string
 *                 example: Atlántico
 *     responses:
 *       201:
 *         description: Departamento creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: País no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authToken, requireRole("admin"), createDepartment);

export default router;
