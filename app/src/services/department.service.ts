import { CreateDepartmentDto } from '../dto/create-department.dto';
import departmentRepository from '../repositories/department.repository';
import countryRepository from '../repositories/country.repository';
import { IDepartmentService } from './interfaces/department.service.interface';
import ErrorHandler from '../error/errorHandler';

class DepartmentService implements IDepartmentService {
  async findByCountryId(countryId: number): Promise<any[]> {
    return await departmentRepository.findByCountryId(countryId);
  }

  async findByPk(id: number): Promise<any | null> {
    return await departmentRepository.findByPk(id);
  }

  async getCities(departmentId: number): Promise<any[]> {
    const department = await departmentRepository.findWithCities(departmentId);
    return (department as any)?.['cities'] || [];
  }

  async create(dto: CreateDepartmentDto, countryId: number): Promise<any> {
    // Validar que el país exista
    const country = await countryRepository.findByPk(countryId);
    if (!country) {
      throw new ErrorHandler(404, `País con ID ${countryId} no encontrado`);
    }

    return await departmentRepository.create({ ...dto, countryId });
  }
}

export default new DepartmentService();
