import ReleaseNotification, {
  ReleaseNotificationCreationAttributes,
} from '../../models/release-notification.model';

export interface IReleaseNotificationRepository {
  findByUserAndMovie(userId: number, movieId: number): Promise<ReleaseNotification | null>;
  findPendingByMovie(movieId: number): Promise<ReleaseNotification[]>;
  updateStatus(id: number, status: 'pendiente' | 'enviada'): Promise<void>;
  create(data: ReleaseNotificationCreationAttributes): Promise<ReleaseNotification>;
}
