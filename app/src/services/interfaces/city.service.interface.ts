import City from '../../models/city.model';
import { CreateCityDto } from '../../dto/create-city.dto';

export interface ICityService {
  findByDepartmentId(departmentId: number): Promise<City[]>;
  findByPk(id: number): Promise<City | null>;
  getCinemas(cityId: number): Promise<any[]>;
  create(dto: CreateCityDto, departmentId: number): Promise<City>;
}
