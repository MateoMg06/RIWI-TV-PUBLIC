import City from '../models/cities.model';
import { CreateCityDto } from '../dto/create-city.dto';
import cityRepository from '../repositories/city.repository';
import cinemaRepository from '../repositories/cinema.repository';
import departmentRepository from '../repositories/department.repository';
import { ICityService } from './interfaces/city.service.interface';
import errorhandler from '../error/errorHandler';

class CityService implements ICityService {
  async findByDepartmentId(departmentId: number): Promise<City[]> {
    return await cityRepository.findByDepartmentId(departmentId);
  }

  async findActiveByDepartmentId(departmentId: number): Promise<City[]> {
    return await cityRepository.findActiveByDepartmentId(departmentId);
  }

  async findByPk(id: number): Promise<City | null> {
    return await cityRepository.findByPk(id);
  }

  async getCinemas(cityId: number): Promise<any[]> {
    return await cinemaRepository.findActiveByCityId(cityId);
  }

  async create(dto: CreateCityDto, departmentId: number): Promise<City> {
    // Validar que el departamento exista
    const department = await departmentRepository.findByPk(departmentId);
    if (!department) {
      throw new errorhandler(404, `Departamento con ID ${departmentId} no encontrado`);
    }

    return await cityRepository.create({ ...dto, departmentId });
  }
}

export default new CityService();
