// app/src/dto/create-country.dto.ts

/**
 * DTO - Creación de pais
 * --------------------------
 * Este DTO representa la información necesaria para crear un pais.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos del  pais
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación del pais
 *
 * @property {string} country - Nombre del pais.
 *
 * @example
 * const dto: CreateCountryDto = {
 *   country: "Colombia"
 *   
 * };
 */

export interface CreateCountryDto {

    /**
     * Nombre completo del pais.
     */
    country: string;


    
}

