import Country from '../../models/country.model';
import Department from '../../models/department.model';
import City from '../../models/city.model';

export interface ILocationRepository {
  getCountries(): Promise<Country[]>;

  getDepartmentByCountry(countryId: number): Promise<Department[]>;

  getCitiesByDepartment(departmentId: number): Promise<City[]>;
}
