import ReleaseNotification, {
  ReleaseNotificationCreationAttributes,
} from '../models/release-notification.model';
import { IReleaseNotificationRepository } from './interfaces/release-notification.repository.interface';

class ReleaseNotificationRepository implements IReleaseNotificationRepository {
  async findByUserAndMovie(userId: number, movieId: number): Promise<ReleaseNotification | null> {
    return await ReleaseNotification.findOne({ where: { userId, movieId } });
  }

  async create(data: ReleaseNotificationCreationAttributes): Promise<ReleaseNotification> {
    return await ReleaseNotification.create(data);
  }
}

export default new ReleaseNotificationRepository();
