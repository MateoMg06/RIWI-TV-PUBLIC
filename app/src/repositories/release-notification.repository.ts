import ReleaseNotification, {
  ReleaseNotificationCreationAttributes,
} from '../models/release-notification.model';
import { IReleaseNotificationRepository } from './interfaces/release-notification.repository.interface';

class ReleaseNotificationRepository implements IReleaseNotificationRepository {
  async findByUserAndMovie(userId: number, movieId: number): Promise<ReleaseNotification | null> {
    return await ReleaseNotification.findOne({ where: { userId, movieId } });
  }

  async findPendingByMovie(movieId: number): Promise<ReleaseNotification[]> {
    return await ReleaseNotification.findAll({ where: { movieId, status: 'pendiente' } });
  }

  async updateStatus(id: number, status: 'pendiente' | 'enviada'): Promise<void> {
    await ReleaseNotification.update({ status }, { where: { id } });
  }

  async create(data: ReleaseNotificationCreationAttributes): Promise<ReleaseNotification> {
    return await ReleaseNotification.create(data);
  }
}

export default new ReleaseNotificationRepository();
