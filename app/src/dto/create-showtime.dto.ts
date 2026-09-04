// app/src/dto/create-showtime.dto.ts

/**
 * DTO - Creación de Showtime
 * ---------------------------
 * Este DTO representa la información necesaria para crear una proyección (Showtime).
 *
 * Un DTO (Data Transfer Object) define el contrato de datos del showtime
 * y la API, evitando exponer directamente el modelo de base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de showtime
 *
 * @property {string} horario - Hora de proyección (formato HH:MM).
 * @property {string} fecha - Fecha de proyección (YYYY-MM-DD).
 * @property {string} sala - Número o nombre de la sala.
 * @property {number} precio - Precio de la entrada.
 *
 * @example
 * const dto: CreateShowtimeDto = {
 *   horario: "19:30",
 *   fecha: "2026-08-20",
 *   sala: "A-5",
 *   precio: 15.99
 * };
 */

export interface CreateShowtimeDto {
  /**
   * Hora de proyección.
   */
  horario: string;

  /**
   * Fecha de proyección.
   */
  fecha: string | Date;

  /**
   * Número o nombre de la sala.
   */
  sala: string;

  /**
   * Precio de la entrada.
   */
  precio: number;
}
