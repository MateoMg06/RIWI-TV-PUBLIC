// app/src/repositories/movie.repository.ts

import Movie, { movieCreationAttributes } from '../models/movie.model';
import { ImovieRepository } from './interfaces/movie.repository.interface';
import movie from '../models/movie.model';

/**
 * Repositorio de Películas
 * -----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad User.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class movieRepository implements ImovieRepository {
    /**
     * Crea un nuevo usuario.
     */
    async create(data: movieCreationAttributes): Promise<movie> {

        return await movie.create(data);

    }

    /**
     * Obtiene todos los usuarios.
     */
    async findAll(): Promise<movie[]> {

        return await movie.findAll();

    }
    
    /**
     * Obtiene uno de los peliculas.
     */
    async findOne(name: string): Promise<movie| string>{

        const resposes =  await movie.findOne({
            where : {name : name}
        });

        return resposes ? resposes : "no lo encontre";
    }

}

export default new movieRepository();
