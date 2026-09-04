import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import errorhandler from '../error/errorHandler';
import releaseNotificationService from '../services/release-notification.service';

class ReleaseNotificationController {
  async requestUpcoming(req: Request, res: Response): Promise<void> {
    try {
      const authenticatedUser = req.user;
      if (!authenticatedUser || typeof authenticatedUser === 'string' || !authenticatedUser.id) {
        res.status(401).json({ error: 'Usuario autenticado sin identificador' });
        return;
      }

      const movieId = Number(req.body.movie_id);
      if (!Number.isInteger(movieId) || movieId <= 0) {
        res.status(400).json({ error: 'movie_id debe ser un número entero positivo' });
        return;
      }

      const notification = await releaseNotificationService.requestUpcomingRelease(
        authenticatedUser.id,
        movieId
      );
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof errorhandler) {
        res.status(error.estado).json({ error: error.message });
        return;
      }

      if (error instanceof UniqueConstraintError) {
        res.status(409).json({ error: 'Ya existe una solicitud para esta película' });
        return;
      }

      res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }
}

export default new ReleaseNotificationController();
