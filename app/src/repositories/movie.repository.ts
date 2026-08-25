// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from '../models/movie.model';
import { Op } from 'sequelize';
import { IMovieRepository } from './interfaces/movie.repository.interface';

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
     * 
     * obtiene las películas de la semana. 
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
                createdAt: {
                    [Op.gte]: startOfWeek,
                    [Op.lte]: endOfWeek
                }
            }
        });
    }


}

export default new MovieRepository();