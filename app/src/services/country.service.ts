import Country from '../models/country.model';
import { CreateCountryDto } from '../dto/create-country.dto';
import countryRepository from '../repositories/country.repository';
import { ICountryService } from './interfaces/country.service.interface';

class CountryService implements ICountryService {
  async findAll(): Promise<Country[]> {
    return await countryRepository.findAll();
  }

  async findByPk(id: number): Promise<Country | null> {
    return await countryRepository.findByPk(id);
  }

  async getDepartments(countryId: number): Promise<any[]> {
    const country = await Country.findByPk(countryId, {
      include: [{ association: 'departments' }]
    });
    return (country as any)?.['departments'] || [];
  }

  async create(dto: CreateCountryDto): Promise<Country> {
    return await countryRepository.create(dto);
  }
}

export default new CountryService();
