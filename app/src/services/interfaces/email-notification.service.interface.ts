export interface IEmailNotificationService {
  sendUpcomingReleaseNotification(userId: number, movieId: number): Promise<void>;
}
