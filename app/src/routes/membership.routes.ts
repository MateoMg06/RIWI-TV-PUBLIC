import { validateJsonBody } from '../middlewares/validateJsonBody';
/**
 * Rutas de Membresía
 * ------------------
 * Define los endpoints HTTP para gestión de membresías.
 */

import { Router } from 'express';
import {
  createMembership,
  getMembership,
  getPurchaseHistory,
} from '../controllers/membership.controller';
import { getBenefits } from '../controllers/profile.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

const router = Router();
router.use(validateJsonBody);

/**
 * @swagger
 * /api/membership:
 *   get:
 *     tags: [Membership]
 *     summary: Consultar la membresía digital del usuario
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Membresía } }
 * /api/membership/benefits:
 *   get:
 *     tags: [Membership]
 *     summary: Consultar nivel, QR, bonos y descuentos vigentes
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Beneficios } }
 */

/**
 * @swagger
 * /api/membership/create:
 *   post:
 *     summary: Crear una membresía para el usuario autenticado
 *     tags: [Membership]
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
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
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 12
 *               initialBonus:
 *                 type: number
 *                 minimum: 0
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
router.post('/create', authToken, requireRole('admin', 'usuario'), createMembership);

/**
 * @swagger
 * /api/membership/me:
 *   get:
 *     summary: Obtener la membresía del usuario autenticado
 *     tags: [Membership]
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
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
router.get('/me', authToken, requireRole('admin', 'usuario'), getMembership);
router.get('/', authToken, requireRole('admin', 'usuario'), getMembership);

/**
 * @swagger
 * /api/membership/purchase-history:
 *   get:
 *     summary: Obtener el historial de compras del usuario autenticado
 *     tags: [Membership]
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
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
router.get('/purchase-history', authToken, requireRole('admin', 'usuario'), getPurchaseHistory);
router.get('/benefits', authToken, requireRole('admin', 'usuario'), getBenefits);

export default router;
