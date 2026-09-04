import type { Request, Response } from 'express';
import { HealthController } from '../controllers/health.controller';
import type { HealthCheckDto } from '../dto/health-check.dto';
import { createHealthRouter } from '../routes/health.routes';
import type { IHealthService } from '../services/interfaces/health.service.interface';

describe('GET /api/v1/health', () => {
  it('registra el método GET en la raíz del router de health', () => {
    const health: HealthCheckDto = {
      status: 'ok',
      service: 'riwi-cine-api',
      version: '1.0.0',
      environment: 'test',
      database: 'up',
      uptimeSeconds: 1,
      timestamp: new Date().toISOString(),
    };
    const service: IHealthService = {
      check: jest.fn().mockResolvedValue(health),
    };
    const router = createHealthRouter(new HealthController(service));
    const layers = (
      router as unknown as {
        stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }>;
      }
    ).stack;
    const healthRoute = layers.find((layer) => layer.route?.path === '/');

    expect(healthRoute?.route?.methods.get).toBe(true);
  });

  it('responde HTTP 200 con el estado entregado por el servicio', async () => {
    const health: HealthCheckDto = {
      status: 'ok',
      service: 'riwi-cine-api',
      version: '1.0.0',
      environment: 'test',
      database: 'up',
      uptimeSeconds: 1,
      timestamp: new Date().toISOString(),
    };
    const service: IHealthService = {
      check: jest.fn().mockResolvedValue(health),
    };
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const controller = new HealthController(service);

    await controller.check({} as Request, { status } as unknown as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(health);
  });
});
