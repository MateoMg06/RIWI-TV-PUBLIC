import Country from '../../models/country.model';
import { CreateCountryDto } from '../../dto/create-country.dto';

export interface ICountryService {
  findAll(): Promise<Country[]>;
  findByPk(id: number): Promise<Country | null>;
  getDepartments(countryId: number): Promise<any[]>;
  create(dto: CreateCountryDto): Promise<Country>;
}
