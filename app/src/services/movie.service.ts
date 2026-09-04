// app/src/services/movie.service.ts

import { IMovieService } from "./interfaces/movie.service.interface";
import movieRepository from "../repositories/movie.repository";
import { MovieCreationAttributes } from "../models/movie.model";
import { GetMovieCatalogDto } from "../dto/get-movie-catalog.dto";
import errorhandler from "../error/errorHandler";

/**
 * Servicio de Películas
 * ----------------------
 * Implementa la lógica de negocio relacionada con la entidad Movie.
 *
 * Esta clase utiliza el repositorio para acceder a los datos y se
 * encarga de transformar el modelo de Sequelize al DTO expuesto por la API.
 */
class MovieService implements IMovieService {

    /**
     * Registra una nueva película.
     */
    async create(data: MovieCreationAttributes): Promise<GetMovieCatalogDto> {
        const movie = await movieRepository.create(data);
        return this.toDto(movie);
    }

    /**
     * Obtiene la cartelera completa de películas.
     */
    async getCatalog(): Promise<GetMovieCatalogDto[]> {
        const movies = await movieRepository.findAll();
        return movies.map(this.toDto);
    }

    /**
     * Obtiene una película por nombre.
     * Lanza un error si no existe.
     */
    async getByName(name: string): Promise<GetMovieCatalogDto> {
        const movie = await movieRepository.findOne(name);

        if (!movie) {
            throw new Error(`Película "${name}" no encontrada`);
        }

        return this.toDto(movie);
    }

    async getUpcoming(cityId?: string): Promise<GetMovieCatalogDto[]> {
        // TODO: Filter by city through Showtime -> Cinema -> City when that flow is integrated.
        void cityId;
        const movies = await movieRepository.findUpcoming();
        return movies.map((movie) => this.toDto(movie));
    }

    async getUpcomingById(id: number): Promise<GetMovieCatalogDto> {
        const movie = await movieRepository.findUpcomingById(id);
        if (!movie) {
            throw new errorhandler(404, 'Película próxima no encontrada');
        }

        return this.toDto(movie);
    }

    /**
     * Mapea una instancia de Movie al DTO de salida.
     */
    private toDto(movie: {
        id: number;
        name: string;
        clasification: string;
        duration: number;
        gener: string;
        synopsis: string | null;
        posterUrl: string | null;
        trailerUrl: string | null;
        releaseDate: string | Date | null;
        status: GetMovieCatalogDto["status"];
        classificationId: number | null;
        languageId: number | null;
    }): GetMovieCatalogDto {
        return {
            id: movie.id,
            name: movie.name,
            clasification: movie.clasification,
            duration: movie.duration,
            gener: movie.gener,
            synopsis: movie.synopsis,
            posterUrl: movie.posterUrl,
            trailerUrl: movie.trailerUrl,
            releaseDate: movie.releaseDate,
            status: movie.status,
            classificationId: movie.classificationId,
            languageId: movie.languageId,
        };
    }
}

export default new MovieService();