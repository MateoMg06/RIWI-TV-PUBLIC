import Country, { CountryCreationAttributes } from '../models/country.model';
import { ICountryRepository } from './interfaces/country.repository.interface';

class CountryRepository implements ICountryRepository {
  async findAll(): Promise<Country[]> {
    return await Country.findAll();
  }

  async findByPk(id: number): Promise<Country | null> {
    return await Country.findByPk(id);
  }

  async create(data: CountryCreationAttributes): Promise<Country> {
    return await Country.create(data);
  }

  async findWithDepartments(countryId: number): Promise<any> {
    return await Country.findByPk(countryId, {
      include: [{ association: 'departments' }]
    });
  }
}

export default new CountryRepository();
