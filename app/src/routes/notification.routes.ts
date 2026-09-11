import { validateJsonBody } from '../middlewares/validateJsonBody';
import { Router } from 'express';
import { requestUpcomingNotification } from '../controllers/notification.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();
router.use(validateJsonBody);

/**
 * @swagger
 * /api/notifications/upcoming:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId: { type: integer, minimum: 1 }
 *               cityId: { type: integer, minimum: 1 }
 *     tags: [Notifications]
 *     summary: Solicitar una única notificación para un próximo estreno
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses:
 *       201: { description: Solicitud registrada }
 *       409: { description: La solicitud ya existe }
 */
router.post('/upcoming', authToken, requestUpcomingNotification);

export default router;
