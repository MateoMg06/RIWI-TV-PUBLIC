import type { Request, Response } from 'express';
import healthService from '../services/health.service';
import type { IHealthService } from '../services/interfaces/health.service.interface';

export class HealthController {
  constructor(private readonly service: IHealthService = healthService) {}

  check = async (_req: Request, res: Response): Promise<void> => {
    const health = await this.service.check();
    res.status(200).json(health);
  };
}

export default new HealthController();
