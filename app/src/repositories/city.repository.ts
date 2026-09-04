import City, { CityCreationAttributes } from '../models/city.model';
import { ICityRepository } from './interfaces/city.repository.interface';

class CityRepository implements ICityRepository {
  async findAll(): Promise<City[]> {
    return await City.findAll();
  }

  async findByPk(id: number): Promise<City | null> {
    return await City.findByPk(id);
  }

  async findByDepartmentId(departmentId: number): Promise<City[]> {
    return await City.findAll({
      where: { departmentId },
    });
  }

  async findWithCinemas(cityId: number): Promise<any> {
    return await City.findByPk(cityId, {
      include: [
        {
          association: 'cinemas',
        },
      ],
    });
  }

  async create(data: CityCreationAttributes): Promise<City> {
    return await City.create(data);
  }
}

export default new CityRepository();
