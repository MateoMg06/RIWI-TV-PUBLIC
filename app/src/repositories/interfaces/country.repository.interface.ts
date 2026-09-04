import Country, { CountryCreationAttributes } from '../../models/country.model';

export interface ICountryRepository {
  findAll(): Promise<Country[]>;
  findByPk(id: number): Promise<Country | null>;
  create(data: CountryCreationAttributes): Promise<Country>;
}
