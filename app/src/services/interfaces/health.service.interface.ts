import type { HealthCheckDto } from '../../dto/health-check.dto';

export interface IHealthService {
  check(): Promise<HealthCheckDto>;
}
