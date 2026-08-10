// app/src/services/interfaces/movie.service.interface.ts

import { MovieCreationAttributes } from "../../models/movie.model";
import { GetMovieCatalogDto } from "../../dto/get-movie-catalog.dto";

/**
 * Contrato del Servicio de Películas
 * -----------------------------------
 * Define la lógica de negocio disponible para la entidad Movie.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */
export interface IMovieService {

    /**
     * Registra una nueva película.
     */
    create(data: MovieCreationAttributes): Promise<GetMovieCatalogDto>;

    /**
     * Obtiene la cartelera completa de películas.
     */
    getCatalog(): Promise<GetMovieCatalogDto[]>;

    /**
     * Obtiene una película por nombre.
     */
    getByName(name: string): Promise<GetMovieCatalogDto>;
}