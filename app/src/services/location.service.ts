import locationRepository from "../repositories/location.repository";
import { ILocationService } from "./interfaces/location.service.interface";



export class LocationService implements ILocationService{

    /**
     * Obtiene todos los paises.
     */
    async getCountries() {

        return await locationRepository.findCountries();
        
    }

     /**
     * Obtiene los departamentos de un pais.
     */
    async getDepartmentByCountry(countryId: number) {

        return await locationRepository.findDepartmentByCountry(countryId);
        
    }

    
     /**
     * Obtiene las ciudades de un departamento.
     */
    async getCitiesByDepartment(departmentId: number) {

        return await locationRepository.findCitiesByDepartment(departmentId);
}

}

export default new LocationService();   