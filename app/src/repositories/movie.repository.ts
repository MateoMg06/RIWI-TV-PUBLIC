// app/src/repositories/movie.repository.ts

import Movie, { MovieCreationAttributes } from '../models/movie.model';
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


}

export default new MovieRepository();