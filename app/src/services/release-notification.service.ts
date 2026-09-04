import ReleaseNotification from '../models/release-notification.model';
import errorhandler from '../error/errorHandler';
import movieRepository from '../repositories/movie.repository';
import releaseNotificationRepository from '../repositories/release-notification.repository';
import emailNotificationService from './email-notification.service';
import { IReleaseNotificationService } from './interfaces/release-notification.service.interface';

class ReleaseNotificationService implements IReleaseNotificationService {
  async requestUpcomingRelease(userId: number, movieId: number): Promise<ReleaseNotification> {
    const movie = await movieRepository.findByPk(movieId);
    if (!movie) {
      throw new errorhandler(404, 'Película no encontrada');
    }

    if (movie.status !== 'proximo_estreno') {
      throw new errorhandler(400, 'La película no está disponible para solicitudes de estreno');
    }

    const existing = await releaseNotificationRepository.findByUserAndMovie(userId, movieId);
    if (existing) {
      throw new errorhandler(409, 'Ya existe una solicitud para esta película');
    }

    const notification = await releaseNotificationRepository.create({ userId, movieId });
    await emailNotificationService.sendUpcomingReleaseNotification(userId, movieId);
    return notification;
  }

  /**
   * Invoke this method from the Movie status transition to `en_cartelera`.
   * The future status-update service should call:
   * `releaseNotificationService.notifyUpcomingMovieRelease(movieId)`.
   */
  async notifyUpcomingMovieRelease(movieId: number): Promise<void> {
    const pendingNotifications = await releaseNotificationRepository.findPendingByMovie(movieId);

    for (const notification of pendingNotifications) {
      try {
        await emailNotificationService.sendUpcomingReleaseNotification(
          notification.userId,
          notification.movieId
        );
        await releaseNotificationRepository.updateStatus(notification.id, 'enviada');
      } catch {
        // Keep the request pending and continue with the remaining recipients.
      }
    }
  }
}

export default new ReleaseNotificationService();
