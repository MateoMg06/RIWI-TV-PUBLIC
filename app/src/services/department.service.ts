import Department from '../models/department.model';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import departmentRepository from '../repositories/department.repository';
import countryRepository from '../repositories/country.repository';
import { IDepartmentService } from './interfaces/department.service.interface';
import errorhandler from '../error/errorHandler';

class DepartmentService implements IDepartmentService {
  async findByCountryId(countryId: number): Promise<Department[]> {
    return await departmentRepository.findByCountryId(countryId);
  }

  async findByPk(id: number): Promise<Department | null> {
    return await departmentRepository.findByPk(id);
  }

  async getCities(departmentId: number): Promise<any[]> {
    const department = await Department.findByPk(departmentId, {
      include: [{ association: 'cities' }]
    });
    return (department as any)?.['cities'] || [];
  }

  async create(dto: CreateDepartmentDto, countryId: number): Promise<Department> {
    // Validar que el país exista
    const country = await countryRepository.findByPk(countryId);
    if (!country) {
      throw new errorhandler(404, `País con ID ${countryId} no encontrado`);
    }

    return await departmentRepository.create({ ...dto, countryId });
  }
}

export default new DepartmentService();
