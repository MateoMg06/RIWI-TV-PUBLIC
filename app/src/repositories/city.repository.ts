import City, { CityCreationAttributes } from '../models/cities.model';
import { ICityRepository } from './interfaces/city.repository.interface';

class CityRepository implements ICityRepository {
  async findAll(): Promise<City[]> {
    return await City.findAll();
  }

  async findAllActive(): Promise<City[]> {
    return await City.findAll({ where: { active: true } });
  }

  async findByPk(id: number): Promise<City | null> {
    return await City.findByPk(id);
  }

  async findByDepartmentId(departmentId: number): Promise<City[]> {
    return await City.findAll({
      where: { departmentId },
    });
  }

  async findActiveByDepartmentId(departmentId: number): Promise<City[]> {
    return await City.findAll({
      where: { departmentId, active: true },
    });
  }

  async create(data: CityCreationAttributes): Promise<City> {
    return await City.create(data);
  }
}

export default new CityRepository();
