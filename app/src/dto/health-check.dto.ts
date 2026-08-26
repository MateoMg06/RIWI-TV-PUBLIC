export interface HealthCheckDto {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  environment: string;
  database: 'up' | 'down';
  uptimeSeconds: number;
  timestamp: string;
}
