/**
 * Rutas de Membresías
 * --------------------
 * Este archivo define los endpoints HTTP relacionados con la entidad Membership.
 *
 * Endpoints disponibles:
 *  - GET /api/memberships : Obtener todas las membresías.
 *  - GET /api/memberships/:id/departments : Obtener departamentos de una membresía.
 *  - POST /api/memberships : Crear una membresía.
 */

import { Router } from 'express';
import {
  getAll,
  getByUserName,
  create,
} from '../controllers/membership.controller';

const router = Router();

/**
 * @swagger
 * /api/memberships:
 *   get:
 *     summary: Obtener todas las membresías
 *     tags:
 *       - Memberships
 *     responses:
 *       200:
 *         description: Lista de membresías obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/memberships:
 *   get:
 *     summary: Obtener todas las membresía por nombre de usuario
 *     tags:
 *       - Memberships
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de usuario
 *     responses:
 *       200:
 *         description: Lista de departamentos obtenida exitosamente
 *       400:
 *         description: Nombre de usuario inválido
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:name/user', getByUserName);

/**
 * @swagger
 * /api/memberships:
 *   post:
 *     summary: Crear una nueva membresía
 *     tags:
 *       - Memberships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Membership
 *             properties:
 *               Membership:
 *                 type: string
 *                 example: Platinum
 *             
 *     responses:
 *       201:
 *         description: Membresia creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', create);

export default router;
