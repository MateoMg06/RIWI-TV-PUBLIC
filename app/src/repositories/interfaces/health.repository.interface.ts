export interface IHealthRepository {
  isDatabaseAvailable(): Promise<boolean>;
}
