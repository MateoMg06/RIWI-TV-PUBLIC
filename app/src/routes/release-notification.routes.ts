import { Router } from 'express';
import releaseNotificationController from '../controllers/release-notification.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();

router.post('/upcoming', authToken, releaseNotificationController.requestUpcoming);

export default router;
