/**
 * DTO - Creación de Usuario
 */

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

