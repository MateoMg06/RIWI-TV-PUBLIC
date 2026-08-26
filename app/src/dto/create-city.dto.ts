// app/src/dto/create-city.dto.ts

/**
 * DTO - Creación de una ciudad
 * --------------------------
 * Este DTO representa la información necesaria para crear una ciudad.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos de la ciudad
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de la ciudad
 *
 * @property {string} city - Nombre de la ciudad.
 *
 * @example
 * const dto: CreateCityDto = {
 *   city: "Barranquilla"
 *   
 * };
 */

export interface CreateCityDto {

    /**
     * Nombre de la ciudad.
     */
    city: string;

    /**
     * Estado activo de la ciudad (opcional, default true).
     */
    active?: boolean;
    
}

