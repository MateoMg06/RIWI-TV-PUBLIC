import { CreateCountryDto } from '../dto/create-country.dto';
import countryRepository from '../repositories/country.repository';
import { ICountryService } from './interfaces/country.service.interface';
import ErrorHandler from '../error/errorHandler';

class CountryService implements ICountryService {
  async findAll(): Promise<any[]> {
    return await countryRepository.findAll();
  }

  async findByPk(id: number): Promise<any | null> {
    return await countryRepository.findByPk(id);
  }

  async getDepartments(countryId: number): Promise<any[]> {
    const country = await countryRepository.findWithDepartments(countryId);
    return (country as any)?.['departments'] || [];
  }

  async create(dto: CreateCountryDto): Promise<any> {
    return await countryRepository.create(dto);
  }
}

export default new CountryService();
