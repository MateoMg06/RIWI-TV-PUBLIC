/**
 * DTO - Creación de Membresía
 */

export interface CreateMembershipDto {
  userId: number;
  durationMonths: number;
  initialBonus?: number;
}
