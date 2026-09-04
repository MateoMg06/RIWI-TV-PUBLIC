import Department from '../../models/department.model';
import { CreateDepartmentDto } from '../../dto/create-department.dto';

export interface IDepartmentService {
  findByCountryId(countryId: number): Promise<Department[]>;
  findByPk(id: number): Promise<Department | null>;
  getCities(departmentId: number): Promise<any[]>;
  create(dto: CreateDepartmentDto, countryId: number): Promise<Department>;
}
