// app/src/dto/create-typeMembership.dto.ts

/**
 * DTO - Creación de typeMembership
 * ---------------------------
 * Este DTO representa la información necesaria para crear una typeMembership.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos de la typeMembership
 * y la API, evitando exponer directamente el modelo de base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de la typeMembership
 *
 * @property {string} name - Nombre del tipo de membresía.
 * @property {number} price - Precio del tipo de membresía.
 * @property {number} discount - Porcentaje de descuento para el tipo de membresía.
 *
 * @example
 * const dto: CreateTypeMembershipDto = {
 *   name: "Premium",
 *   price: 19.99,
 *   discount: 0.2
 * };
 */

export interface CreateTypeMembershipDto {
  /**
   * Nombre del tipo de membresía.
   */
  name: string;
  /**
   * Precio del tipo de membresía.
   */
  price: number;
  /**
   * Porcentaje de descuento para el tipo de membresía.
   */
  discount: number;

  
}
