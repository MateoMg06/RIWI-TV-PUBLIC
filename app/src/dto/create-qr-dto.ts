// app/src/dto/create-qr.dto.ts

/**
 * DTO - Creación de QR
 * ---------------------------
 * Este DTO representa la información necesaria para crear un QR.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos
 * entre el cliente y la API, evitando exponer directamente
 * el modelo de base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación del QR.
 *
 * @property {number} membershipId - ID de la membresía a la que
 * pertenece el QR.
 *
 * @example
 * const dto: CreateQrDto = {
 *   membershipId: 1
 * };
 */

export interface CreateQrDto {
  /**
   * Id de la membresía.
   */
  membershipId: number;

  
}
