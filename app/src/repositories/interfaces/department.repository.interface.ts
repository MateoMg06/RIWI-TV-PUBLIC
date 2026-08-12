import Department, { DepartmentCreationAttributes } from '../../models/department.model';

export interface IDepartmentRepository {
  findAll(): Promise<Department[]>;
  findByPk(id: number): Promise<Department | null>;
  findByCountryId(countryId: number): Promise<Department[]>;
  create(data: DepartmentCreationAttributes): Promise<Department>;
}
