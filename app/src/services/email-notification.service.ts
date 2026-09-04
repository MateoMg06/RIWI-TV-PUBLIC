import { IEmailNotificationService } from './interfaces/email-notification.service.interface';

/**
 * Email provider boundary. Replace this stub with the configured email provider
 * when release notification delivery is implemented.
 */
class EmailNotificationService implements IEmailNotificationService {
  async sendUpcomingReleaseNotification(_userId: number, _movieId: number): Promise<void> {
    // Delivery is intentionally deferred; requests remain pending until a provider exists.
  }
}

export default new EmailNotificationService();
