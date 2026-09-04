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
 * @property {string} clasification - Clasificación de la película.
 * @property {number} duration - Duración de la película en minutos.
 * @property {string} gener - Género de la película.
 * @property {string} pais - pais de la película.
 * @property {string} departamento - departamento de la película.
 * @property {string} ciudad - ciudad de la película.
 * @example
 * const dto: CreateMovieDto = {
 *   name: "Spiderman",
 *   clasification: "PG-13",
 *   duration: 120,
 *   gener: "Acción",
 *   pais: "Colombia",
 *   departamento: "Atlantico",
 *   ciudad: "Barranquilla"
 * };
 */

export interface CreateMovieDto {

    /**
     * Nombre completo de la película.
     */
    name: string;

    /**
     * Clasificación de la película.
     */
    clasification: string;

    /**
     * Duración de la película en minutos.
     */
    duration: number;

    /**
     * Género de la película.
     */
    gener: string;

     /**
     * pais de la película.
     */
    pais: string;

     /**
     * departamento de la película.
     */
    departamento: string;

     /**
     * ciudad de la película.
     */
    ciudad: string;

    synopsis?: string;
    posterUrl?: string;
    trailerUrl?: string;
    status?: "proximo_estreno" | "en_cartelera" | "fuera_cartelera";
    classificationId?: number;
    languageId?: number;
}

