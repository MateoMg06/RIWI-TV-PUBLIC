// app/src/services/movie.service.ts

import movie from "../models/movie.model";
import { CreateMovieDto } from "../dto/create-movie.dto";
import repository from "../repositories/movie.repository";
import { ImovieService } from "./interfaces/movie.service.interface";
import Movie from "../repositories/movie.repository"
;


/**
 * Servicio de Películas
 * ---------------------
 * Contiene toda la lógica de negocio relacionada con la entidad Movie.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre uno o varios repositorios.
 *  - Orquestar procesos antes y después de persistir información.
 *  - Mantener al controlador libre de lógica de negocio.
 *
 * Ejemplos de reglas de negocio:
 *
 *  Verificar que el correo electrónico no exista antes de crear el usuario.
 *  Validar que el dominio del correo pertenezca a la empresa.
 *  Encriptar la contraseña antes de almacenarla.
 *  Asignar un rol por defecto (Ej. "CLIENTE").
 *  Registrar un log de auditoría de la operación.
 *  Enviar un correo de bienvenida después del registro.
 *  Crear automáticamente un perfil asociado al usuario.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */

class movieService implements ImovieService {

    async create(dto: CreateMovieDto): Promise<movie> {

        /**
         * Ejemplo de regla de negocio:
         *
         * Antes de crear un usuario podríamos validar que el correo
         * electrónico no se encuentre registrado.
         *
         * const existingUser = await repository.findByEmail(dto.email);
         *
         * if (existingUser) {
         *     throw new Error("El correo electrónico ya se encuentra registrado.");
         * }
         *
         * También podríamos:
         *  - Encriptar la contraseña.
         *  - Asignar un rol por defecto.
         *  - Registrar la operación en una bitácora.
         *  - Enviar un correo de bienvenida.
         */

        return await repository.create(dto);

    }

    /**
     * Recupera todos los usuarios registrados en el sistema.
     *
     * Este método delega la consulta al repositorio de usuarios, el cual es el
     * responsable de interactuar con la base de datos. En esta capa podrían
     * incorporarse reglas de negocio adicionales, como filtros, paginación,
     * ordenamiento o transformaciones de los datos antes de ser enviados al
     * controlador.
     *
     * @async
     * @returns {Promise<movie[]>} Promesa que resuelve con un arreglo de objetos
     *                            de tipo {@link movie} que representan las películas
     *                            encontradas en la base de datos.
     *
     * @example
     * const movies = await movieService.findAll();
     *
     * console.log(movies);
     * // [
     * //   {
     * //     id: 1,
     * //     name: "spider man",
     * //     classification: "PG-13",
     * //     duration: 120,
     * //     genre: "Action"
     * //   }
     * // ]
     */
    async findAll(): Promise<movie[]> {
        return await repository.findAll();
    }
    async findCredential(name: string): Promise<movie | string>  {
        const movie=await repository.findOne(name)
        
        if (!movie){
           throw new Error('401 nombre inválido');
        }
        
        return movie;
    }

    async findOne(name :string): Promise<movie | string> {
        return await repository.findOne(name);
    }

}

export default new movieService();