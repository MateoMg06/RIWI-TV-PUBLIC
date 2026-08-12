// app/src/controllers/location.controller.ts

import { Request, Response } from "express";
import locationService from "../services/location.service";

/**
 * Controlador de Localización
 * ---------------------------
 * Maneja las solicitudes HTTP relacionadas con
 * países, departamentos y ciudades.
 *
 * Recibe Request/Response de Express,
 * delega la lógica al service y construye
 * la respuesta HTTP correspondiente.
 */
class LocationController {

    /**
     * GET /locations/countries
     * Obtiene todos los países.
     */
    async getCountries(req: Request, res: Response): Promise<void> {
        try {
            const countries = await locationService.getCountries();

            res.status(200).json(countries);

        } catch (error) {
            res.status(500).json({
                message: "Error al obtener los países",
                error: error instanceof Error ? error.message : error,
            });
        }
    }


    /**
     * GET /locations/departments/:countryId
     * Obtiene los departamentos de un país.
     */
    async getDepartmentsByCountry(
        req: Request,
        res: Response
    ): Promise<void> {

        try {
            const countryId = Number(req.params.countryId);

            const departments =
                await locationService.getDepartmentByCountry(countryId);

            res.status(200).json(departments);

        } catch (error) {
            res.status(500).json({
                message: "Error al obtener los departamentos",
                error: error instanceof Error ? error.message : error,
            });
        }
    }


    /**
     * GET /locations/cities/:departmentId
     * Obtiene las ciudades de un departamento.
     */
    async getCitiesByDepartment(
        req: Request,
        res: Response
    ): Promise<void> {

        try {
            const departmentId = Number(req.params.departmentId);

            const cities =
                await locationService.getCitiesByDepartment(departmentId);

            res.status(200).json(cities);

        } catch (error) {
            res.status(500).json({
                message: "Error al obtener las ciudades",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
}

export default new LocationController();