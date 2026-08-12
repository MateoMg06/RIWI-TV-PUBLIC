import Country, { CountryCreationAttributes } from "../models/country.model";
import Department, { DepartmentCreationAttributes } from "../models/department.model";
import City, { CityCreationAttributes } from "../models/cities.model";



class LocationRepository{
    async findCountries(): Promise<Country[]>{
        // consulta a la BD
        return[];
    }

    async findDepartmentByCountry(
        countryId : number):
    Promise<Department[]>{
        // consulta BD
    return [];
    } 

    async findCitiesByDepartment(
        departmentId: number):
    Promise<City[]>{
        // consulta BD
        return [];
    }

}

export default new LocationRepository()
