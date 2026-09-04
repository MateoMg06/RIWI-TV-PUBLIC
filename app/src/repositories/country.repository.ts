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
}

export default new CountryRepository();
