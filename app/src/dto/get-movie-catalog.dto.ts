// app/src/dto/get-movie-catalog.dto.ts

/**
 * DTO - Cartelera de Películas
 * -----------------------------
 * Representa la forma de una película tal como se expone al cliente
 * en el endpoint de consulta de cartelera (listado de películas disponibles).
 *
 * @property {number} id - Identificador único de la película.
 * @property {string} name - Nombre completo de la película.
 * @property {string} clasification - Clasificación de la película.
 * @property {number} duration - Duración de la película en minutos.
 * @property {string} gener - Género de la película.
 * @example
 * const dto: GetMovieCatalogDto = {
 *   id: 1,
 *   name: "Spiderman",
 *   clasification: "PG-13",
 *   duration: 120,
 *   gener: "Acción"
 * };
 */
export interface GetMovieCatalogDto {

    /**
     * Identificador único de la película.
     */
    id: number;

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
}