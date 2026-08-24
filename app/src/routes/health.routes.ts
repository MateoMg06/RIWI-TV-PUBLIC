import { Router } from 'express';
import healthController, { HealthController } from '../controllers/health.controller';

export function createHealthRouter(controller: HealthController = healthController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/health:
   *   get:
   *     summary: Verifica la disponibilidad de la API y PostgreSQL
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Estado actual del servicio
   */
  router.get('/', controller.check);

  return router;
}

export default createHealthRouter();
