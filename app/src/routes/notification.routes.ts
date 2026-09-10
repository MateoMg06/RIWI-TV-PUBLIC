import { Router } from 'express';
import { requestUpcomingNotification } from '../controllers/notification.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();

/**
 * @swagger
 * /api/notifications/upcoming:
 *   post:
 *     tags: [Notifications]
 *     summary: Solicitar una única notificación para un próximo estreno
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses:
 *       201: { description: Solicitud registrada }
 *       409: { description: La solicitud ya existe }
 */
router.post('/upcoming', authToken, requestUpcomingNotification);

export default router;
