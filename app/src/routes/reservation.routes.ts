import { validateJsonBody } from '../middlewares/validateJsonBody';
import { Router } from 'express';
import {
  getReservationSummary,
  lockSeats,
  releaseSeats,
} from '../controllers/reservation.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();
router.use(validateJsonBody);

/**
 * @swagger
 * /api/reservations/lock-seats:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [showtimeId, seatIds]
 *             properties:
 *               showtimeId: { type: integer, minimum: 1 }
 *               seatIds:
 *                 type: array
 *                 minItems: 1
 *                 uniqueItems: true
 *                 items: { type: integer, minimum: 1 }
 *               acceptsAccessiblePolicy: { type: boolean, default: false }
 *     tags: [Reservations]
 *     summary: Bloquear sillas durante diez minutos con control de concurrencia
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 201: { description: Sillas bloqueadas }, 409: { description: Silla no disponible } }
 * /api/reservations/release-seats:
 *   delete:
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatIds:
 *                 type: array
 *                 items: { type: integer, minimum: 1 }
 *     tags: [Reservations]
 *     summary: Liberar sillas bloqueadas por el usuario
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Sillas liberadas } }
 * /api/reservations/summary:
 *   get:
 *     tags: [Reservations]
 *     summary: Resumen y total de las sillas seleccionadas
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Resumen de compra } }
 */
router.post('/lock-seats', authToken, lockSeats);
router.delete('/release-seats', authToken, releaseSeats);
router.get('/summary', authToken, getReservationSummary);

export default router;
