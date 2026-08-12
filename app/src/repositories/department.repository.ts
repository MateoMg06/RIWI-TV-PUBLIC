import Department, { DepartmentCreationAttributes } from '../models/department.model';
import { IDepartmentRepository } from './interfaces/department.repository.interface';

class DepartmentRepository implements IDepartmentRepository {
  async findAll(): Promise<Department[]> {
    return await Department.findAll();
  }

  async findByPk(id: number): Promise<Department | null> {
    return await Department.findByPk(id);
  }

  async findByCountryId(countryId: number): Promise<Department[]> {
    return await Department.findAll({
      where: { countryId },
    });
  }

  async create(data: DepartmentCreationAttributes): Promise<Department> {
    return await Department.create(data);
  }
}

export default new DepartmentRepository();
