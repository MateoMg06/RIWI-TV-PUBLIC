// app/src/services/movie.service.ts

import { IMovieService } from "./interfaces/movie.service.interface";
import movieRepository from "../repositories/movie.repository";
import { MovieCreationAttributes } from "../models/movie.model";
import { GetMovieCatalogDto } from "../dto/get-movie-catalog.dto";
import cityRepository from "../repositories/city.repository";
import cinemaRepository from "../repositories/cinema.repository";
import showtimeRepository from "../repositories/showtime.repository";
import Movie from "../models/movie.model";
import errorhandler from "../error/errorHandler";
import { Op } from "sequelize";

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
     * Obtiene la cartelera filtrada por ciudad: solo funciones ACTIVE de cines activos en ciudad activa.
     * Maneja caso sin funciones sin lanzar 500.
     */
    async getCatalogByCity(cityId: number): Promise<{ city: any; data: GetMovieCatalogDto[]; message?: string }> {
        const city = await cityRepository.findByPk(cityId);
        if (!city) throw new errorhandler(404, 'Ciudad no encontrada');
        if (!city.active) throw new errorhandler(422, 'Ciudad inactiva');

        // Si la ciudad no tiene cines activos, retornar vacío con mensaje (no error)
        const activeCinemasCount = await cinemaRepository.countActiveByCityId(cityId);
        if (activeCinemasCount === 0) {
            return { city, data: [], message: 'Actualmente no existen funciones activas disponibles para esa ciudad.' };
        }

        const activeShowtimes = await showtimeRepository.findActiveByCityId(cityId);
        if (!activeShowtimes || activeShowtimes.length === 0) {
            return { city, data: [], message: 'Actualmente no existen funciones activas disponibles para esa ciudad.' };
        }

        const movieIds = [...new Set(activeShowtimes.map((s: any) => s.movieId))];
        const movies = await Movie.findAll({
            where: { id: { [Op.in]: movieIds } },
            order: [['name', 'ASC']],
        });

        if (!movies.length) {
            return { city, data: [], message: 'Actualmente no existen funciones activas disponibles para esa ciudad.' };
        }

        return { city, data: movies.map(this.toDto) };
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

    /**
     * Mapea una instancia de Movie al DTO de salida.
     */
    private toDto(movie: { id: number; name: string; clasification: string; duration: number; gener: string }): GetMovieCatalogDto {
        return {
            id: movie.id,
            name: movie.name,
            clasification: movie.clasification,
            duration: movie.duration,
            gener: movie.gener,
        };
    }
}

export default new MovieService();