/**
 * Rutas de Membresías
 * --------------------
 * Este archivo define los endpoints HTTP relacionados con la entidad Membership.
 *
 * Endpoints disponibles:
 *  - GET /api/memberships : Obtener todas las membresías.
 *  - GET /api/memberships/:name/user : Obtener membresía por nombre de usuario.
 *  - POST /api/memberships : Crear una membresía.
 *  - POST /api/membership/create : Crear una membresía para el usuario autenticado.
 *  - GET /api/membership/me : Obtener la membresía del usuario autenticado.
 *    Este es el GET /membership que pidieron (info completa para ver en el perfil).
 *  - GET /api/membership/purchase-history : Obtener el historial de compras.
 *  - GET /api/membership/benefits : Obtener los beneficios vigentes del usuario.
 *    Este es el GET /membership/benefits que pidieron.
 */

import { Router } from 'express';
import {
  getAll,
  getByUserName,
  create,
  createMembership,
  getMembership,
  getPurchaseHistory,
  getBenefits,
} from '../controllers/membership.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

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
 * /api/memberships/{name}/user:
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
 */
router.post('/', create);

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
router.post('/create', authToken, requireRole("admin", "usuario"), createMembership);

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
router.get('/me', authToken, requireRole("admin", "usuario"), getMembership);

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
router.get('/purchase-history', authToken, requireRole("admin", "usuario"), getPurchaseHistory);

/**
 * @swagger
 * /api/membership/benefits:
 *   get:
 *     summary: Obtener los beneficios vigentes de mi membresia
 *     tags: [Membership]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Beneficios vigentes, nivel, descuento y QR
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/benefits', authToken, requireRole("admin", "usuario"), getBenefits);

export default router;
