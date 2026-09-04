import City, { CityCreationAttributes } from '../../models/city.model';

export interface ICityRepository {
  findAll(): Promise<City[]>;
  findByPk(id: number): Promise<City | null>;
  findByDepartmentId(departmentId: number): Promise<City[]>;
  findWithCinemas(cityId: number): Promise<any>;
  create(data: CityCreationAttributes): Promise<City>;
}
