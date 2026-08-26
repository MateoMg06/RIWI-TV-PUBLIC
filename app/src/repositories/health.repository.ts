import sequelize from '../config/database';
import type { IHealthRepository } from './interfaces/health.repository.interface';

class HealthRepository implements IHealthRepository {
  async isDatabaseAvailable(): Promise<boolean> {
    try {
      await sequelize.authenticate();
      return true;
    } catch {
      return false;
    }
  }
}

export default new HealthRepository();
