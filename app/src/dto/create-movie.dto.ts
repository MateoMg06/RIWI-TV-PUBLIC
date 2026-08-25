// app/src/dto/create-movie.dto.ts

/**
 * DTO - Creación de Película
 * --------------------------
 * Este DTO representa la información necesaria para crear una nueva película.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre la pelicula
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de peliculas.
 *
 * @property {string} name - Nombre completo de la película.
 * @property {string} synopsis - Sinopsis de la película.
 * @property {string} classification - Clasificación de la película.
 * @property {number} duration - Duración de la película en minutos.
 * @property {string} genre - Género de la película.
 * @property {string} director - Director de la película.
 * @property {string} cast - Reparto de la película.
 * @property {string} poster_url - URL del póster de la película.
 * @property {string} banner_url - URL del banner de la película.
 * @property {string} trailer_url - URL del tráiler de la película.
 * @property {Date} release_date - Fecha de estreno de la película.
 * @property {boolean} status - Estado de la película (activa/inactiva).
 * @property {number} audience_rating - Calificación del público para la película.
 * @property {Date} createdAt - Fecha de creación del registro.
 * @property {Date} updatedAt - Fecha de última actualización del registro.
 *
 * @example
 * const dto: CreateMovieDto = {
 *   name: "Spiderman",
 *   classification: "PG-13",
 *   duration: 120,
 *   genre: "Acción",
 *   director: "Sam Raimi",
 *   cast: "Tobey Maguire, Kirsten Dunst",
 *   poster_url: "https://example.com/poster.jpg",
 *   banner_url: "https://example.com/banner.jpg",
 *   trailer_url: "https://example.com/trailer.mp4",
 *   release_date: new Date("2002-05-03"),
 *   status: true,
 *   audience_rating: 8.5,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * };
 */

export interface CreateMovieDto {

    /**
     * Nombre completo de la película.
     */
    name: string;

    /**
     * Sinopsis de la película.
     */
    synopsis: string;

    /**
     * Clasificación de la película.
     */
    classification: string;

    /**
     * Duración de la película en minutos.
     */
    duration: number;

    /**
     * Género de la película.
     */
    genre: string;

    /**
     * Director de la película.
     */
    director: string;

    /**
     * Reparto de la película.
     */
    cast: string;

    /**
     * URL del póster de la película.
     */
    poster_url: string;

    /**
     * URL del banner de la película.
     */
    banner_url: string;

    /**
     * URL del tráiler de la película.
     */
    trailer_url: string;

    /**
     * Fecha de estreno de la película.
     */
    release_date: Date;

    /**
     * Estado de la película (activa/inactiva).
     */
    status: boolean;

    /**
     * Calificación del público para la película.
     */
    audience_rating: number;

    /**
     * Fecha de creación del registro.
     */
    createdAt: Date;

    /**
     * Fecha de última actualización del registro.
     */
    updatedAt: Date;
    
    
}

