import type { HealthCheckDto } from '../dto/health-check.dto';
import healthRepository from '../repositories/health.repository';
import type { IHealthRepository } from '../repositories/interfaces/health.repository.interface';
import type { IHealthService } from './interfaces/health.service.interface';

export class HealthService implements IHealthService {
  constructor(private readonly repository: IHealthRepository = healthRepository) {}

  async check(): Promise<HealthCheckDto> {
    const databaseAvailable = await this.repository.isDatabaseAvailable();

    return {
      status: databaseAvailable ? 'ok' : 'degraded',
      service: 'riwi-cine-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: databaseAvailable ? 'up' : 'down',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}

export default new HealthService();
