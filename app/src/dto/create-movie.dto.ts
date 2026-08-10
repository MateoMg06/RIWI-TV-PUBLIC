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
 * @property {string} director - director de la pelicula
 * @property {string} idioma - idioma de la pelicula
   @property {string} traduccion - traduccion de la pelicula
   @property {string} formatos - formatos de la pelicula
   @property {string} horarios -  horarios de la pelicula
   @property {number} valorEntradaFormato valor de la entrada
  @property {date} fechaEstreno fecha de estreno
  @property {string} actoresPrincipales actores de la pelicula
  @property {string} sinopsis sinopsis de la pelicula
  @property {string} trailer trailer de la pelicula
  @property {string} banner banner de la pelicula
  @property {string} poster
  @property {string} posterOficial

 * @example
 * const dto: CreateMovieDto = {
 *   name: "Spiderman",
 *   clasification: "PG-13",
 *   duration: 120,
 *   gener: "Acción"
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

    director :string;

    idioma :string;

    traduccion: string;

    formatos: string;

    horarios:string;

    valorEntradaFormato: number;
    
    fechaEstreno: Date;

    actoresPrincipales: string;

    sinopsis: string;

    trailer: string;

    banner: string;

    poster:string;
    
    posterOficial: string;
}

