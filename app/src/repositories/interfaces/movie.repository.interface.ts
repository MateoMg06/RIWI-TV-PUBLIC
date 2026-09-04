// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie, { MovieCreationAttributes } from "../../models/movie.model";

/**
 * Filtros disponibles para la consulta de películas.
 */
export interface MovieFilters {
  genre?: string;
  status?: boolean;
}

/**
 * Contrato del Repositorio de Películas
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Movie.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */
export interface IMovieRepository {

    /**
     * Crea una película.
     */
    create(data: MovieCreationAttributes): Promise<Movie>;

    /**
     * Obtiene todas las películas.
     */
    findAll(): Promise<Movie[]>;

    /**
     * Obtiene una película por nombre.
     */
    findOne(name: string): Promise<Movie | null>;

    /**
     * Obtiene una película por ID.
     */
    findByPk(id: number): Promise<Movie | null>;

    /**
     * Obtiene las películas de la semana (por fecha de estreno).
     */
    findWeeklyMovies(): Promise<Movie[]>;

    /**
     * Obtiene las películas que estrenan hoy.
     */
    findTodayMovies(): Promise<Movie[]>;

    /**
     * Obtiene las películas según los filtros aplicados.
     */
    findFilteredMovies(filters: MovieFilters): Promise<Movie[]>;
}