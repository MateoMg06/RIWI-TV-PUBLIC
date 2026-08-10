// app/src/services/interfaces/movie.service.interface.ts

import movie from "../../models/movie.model";
import { CreateMovieDto } from "../../dto/create-movie.dto";

/**
 * Contrato del Servicio de Películas.
 */

export interface ImovieService {

    create(dto: CreateMovieDto): Promise<movie>;

    findAll(): Promise<movie[]>;

}