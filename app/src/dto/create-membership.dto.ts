/**
 * DTO - Creación de Membresía
 * ---------------------------
 * Este DTO representa la información necesaria para crear una membresía.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos de la membresía
 * y la API, evitando exponer directamente el modelo de base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de la membresía
 *
 * @property {string} membershipType - Tipo de membresía.
 * @property {number} userId - ID del usuario al que pertenece la membresía.
 * @property {number} durationMonths - Duración en meses de la membresía.
 * @property {number} [initialBonus] - Bonificación inicial opcional.
 *
 * @example
 * const dto: CreateMembershipDto = {
 *   membershipType: "Premium",
 *   userId: 1,
 *   durationMonths: 12,
 *   initialBonus: 100
 * };
 */

export interface CreateMembershipDto {
  /**
   * Tipo de membresía.
   */
  membershipType: string;

  /**
   * ID del usuario.
   */
  userId: number;

  /**
   * Duración en meses de la membresía.
   */
  durationMonths: number;

  /**
   * Bonificación inicial (opcional).
   */
  initialBonus?: number;
}
