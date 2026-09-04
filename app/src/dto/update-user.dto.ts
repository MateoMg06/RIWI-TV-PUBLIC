/**
 * DTO - Actualización de usuario
 */
export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string;
  city?: string;
  acceptsDataProcessing?: boolean;
  acceptsTerms?: boolean;
  acceptsNotifications?: boolean;
}
