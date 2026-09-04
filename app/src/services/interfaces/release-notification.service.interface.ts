import ReleaseNotification from '../../models/release-notification.model';

export interface IReleaseNotificationService {
  requestUpcomingRelease(userId: number, movieId: number): Promise<ReleaseNotification>;
  notifyUpcomingMovieRelease(movieId: number): Promise<void>;
}
