import ReleaseNotification, {
  ReleaseNotificationCreationAttributes,
} from '../../models/release-notification.model';

export interface IReleaseNotificationRepository {
  findByUserAndMovie(userId: number, movieId: number): Promise<ReleaseNotification | null>;
  create(data: ReleaseNotificationCreationAttributes): Promise<ReleaseNotification>;
}
