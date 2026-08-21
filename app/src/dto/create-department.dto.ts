// app/src/dto/create-department.dto.ts

/**
 * DTO - Creación de departamento
 * --------------------------
 * Este DTO representa la información necesaria para crear un departamento.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos del  departamento
 * y la API, evitando exponer directamente el modelo de base de datos.
 * utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación del departamento
 *
 * @property {string} department - Nombre del departamento.
 *
 * @example
 * const dto: CreateDepartmentDto = {
 *   department: "Atlantico"
 *   
 * };
 */

export interface CreateDepartmentDto {

    /**
     * Nombre del departamento.
     */
    department: string;


    
}

