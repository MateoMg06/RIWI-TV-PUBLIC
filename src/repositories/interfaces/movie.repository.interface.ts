// app/src/repositories/interfaces/movie.repository.interface.ts

import movie, { movieCreationAttributes } from "../../models/movie.model";

/**
 * Contrato del Repositorio de Películas
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad User.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface ImovieRepository {

    /**
     * Crea un usuario.
     */
    create(data: movieCreationAttributes): Promise<movie>;

    /**
     * Obtiene todos los usuarios.
     */
    findAll(): Promise<movie[]>;

    /**
     * Obtiene uno de los usuarios.
     */
    findOne(name:string): Promise<movie|string>;
}