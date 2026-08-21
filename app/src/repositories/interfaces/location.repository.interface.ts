
import Country, { CountryCreationAttributes } from "../../models/country.model";
import Department, { DepartmentCreationAttributes } from "../../models/department.model";
import City, { CityCreationAttributes } from "../../models/cities.model";

export interface ILocationRepository {
    getCountries(): Promise<Country[]>;

    getDepartmentByCountry(
        countryId: number
    ): Promise<Department[]>;


    getCitiesByDepartment(
        departmentId: number
    ): Promise<City[]>;


}