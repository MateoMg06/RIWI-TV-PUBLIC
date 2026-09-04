/**
 * DTO - Creación de Usuario
 */

export interface CreateUserDto {
  name: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  city: string;
  acceptsDataProcessing: boolean;
  acceptsTerms: boolean;
  acceptsNotifications: boolean;
  role?: string;
}
