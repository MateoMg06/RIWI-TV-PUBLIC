// app/src/dto/create-cinema.dto.ts

/**
 * DTO - Creación de Cine
 * ----------------------
 * Este DTO representa la información necesaria para crear un cine.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos del cine
 * y la API, evitando exponer directamente el modelo de base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación del cine
 *
 * @property {string} name - Nombre del cine.
 * @property {number} cityId - ID de la ciudad donde está el cine.
 *
 * @example
 * const dto: CreateCinemaDto = {
 *   name: "Cinemark Centro",
 *   cityId: 1
 * };
 */

export interface CreateCinemaDto {
  /**
   * Nombre del cine.
   */
  name: string;

  /**
   * ID de la ciudad.
   */
  cityId: number;

  /**
   * Estado activo del cine (opcional, default true).
   */
  active?: boolean;
}
