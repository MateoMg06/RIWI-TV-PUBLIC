import type { IHealthRepository } from '../repositories/interfaces/health.repository.interface';
import { HealthService } from '../services/health.service';

describe('HealthService', () => {
  it('reporta la API y la base de datos disponibles', async () => {
    const repository: IHealthRepository = {
      isDatabaseAvailable: jest.fn().mockResolvedValue(true),
    };
    const service = new HealthService(repository);

    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
    expect(result.service).toBe('riwi-cine-api');
    expect(result.timestamp).toEqual(expect.any(String));
  });

  it('reporta un estado degradado cuando PostgreSQL no está disponible', async () => {
    const repository: IHealthRepository = {
      isDatabaseAvailable: jest.fn().mockResolvedValue(false),
    };
    const service = new HealthService(repository);

    const result = await service.check();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe('down');
  });
});
