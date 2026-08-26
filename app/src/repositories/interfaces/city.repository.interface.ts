import City, { CityCreationAttributes } from '../../models/cities.model';

export interface ICityRepository {
  findAll(): Promise<City[]>;
  findAllActive(): Promise<City[]>;
  findByPk(id: number): Promise<City | null>;
  findByDepartmentId(departmentId: number): Promise<City[]>;
  findActiveByDepartmentId(departmentId: number): Promise<City[]>;
  create(data: CityCreationAttributes): Promise<City>;
}
