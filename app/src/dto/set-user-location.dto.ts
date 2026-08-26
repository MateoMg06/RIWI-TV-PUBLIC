// app/src/dto/set-user-location.dto.ts

/**
 * DTO - Asignación de ubicación al usuario
 * ----------------------------------------
 * Define el contrato para POST /users/location
 *
 * @property cityId - ID de la ciudad activa con al menos un cine activo
 * @example { "cityId": 1 }
 */
export interface SetUserLocationDto {
  cityId: number;
}
