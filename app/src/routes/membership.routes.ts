/**
 * Rutas de Membresía
 * ------------------
 * Define los endpoints HTTP para gestión de membresías.
 */

import { Router } from 'express';
import { createMembership, getMembership, getPurchaseHistory } from '../controllers/membership.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();

/**
 * @swagger
 * /api/membership/create:
 *   post:
 *     summary: Crear una membresía para el usuario autenticado
 *     tags: [Membership]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - durationMonths
 *             properties:
 *               durationMonths:
 *                 type: number
 *                 example: 12
 *               initialBonus:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya tiene membresía
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/create', authToken, createMembership);

/**
 * @swagger
 * /api/membership/me:
 *   get:
 *     summary: Obtener la membresía del usuario autenticado
 *     tags: [Membership]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Membresía obtenida exitosamente
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/me', authToken, getMembership);

/**
 * @swagger
 * /api/membership/purchase-history:
 *   get:
 *     summary: Obtener el historial de compras del usuario autenticado
 *     tags: [Membership]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Historial de compras obtenido exitosamente
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/purchase-history', authToken, getPurchaseHistory);

export default router;
