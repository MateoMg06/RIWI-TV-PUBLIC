// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from '../models/movie.model';
import { Op } from 'sequelize';
import { IMovieRepository, MovieFilters } from './interfaces/movie.repository.interface';

/**
 * Repositorio de Películas
 * -----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Movie.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */
class MovieRepository implements IMovieRepository {

    /**
     * Crea una nueva película.
     */
    async create(data: MovieCreationAttributes): Promise<Movie> {
        return await Movie.create(data);
    }

    /**
     * Obtiene todas las películas.
     */
    async findAll(): Promise<Movie[]> {
        return await Movie.findAll();
    }

    /**
     * Obtiene una película por nombre.
     */
    async findOne(name: string): Promise<Movie | null> {
        return await Movie.findOne({
            where: { name: name }
        });
    }

    /**
     * Obtiene una película por ID.
     */
    async findByPk(id: number): Promise<Movie | null> {
        return await Movie.findByPk(id);
    }

    /**
     * Obtiene las películas que estrenan durante la semana actual.
     * La semana se calcula de domingo a sábado y filtra por release_date.
     */
    async findWeeklyMovies(): Promise<Movie[]> {
        const today = new Date();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() - today.getDay() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return await Movie.findAll({
            where: {
                release_date: {
                    [Op.gte]: startOfWeek,
                    [Op.lte]: endOfWeek
                },
                status: true
            }
        });
    }

    /**
     * Obtiene las películas que estrenan hoy.
     */
    async findTodayMovies(): Promise<Movie[]> {
        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        return await Movie.findAll({
            where: {
                release_date: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                },
                status: true
            }
        });
    }

    /**
     * Obtiene las películas según los filtros aplicados (género y/o estado).
     */
    async findFilteredMovies(filters: MovieFilters): Promise<Movie[]> {
        const where: Record<string, unknown> = {};

        if (filters.genre) {
            where.genre = filters.genre;
        }

        if (typeof filters.status === 'boolean') {
            where.status = filters.status;
        }

        return await Movie.findAll({ where });
    }


}

export default new MovieRepository();