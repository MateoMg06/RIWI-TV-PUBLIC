// app/src/repositories/interfaces/membership.repository.interface.ts

import {CreateMembershipDto} from "../../dto/create-membership.dto";

/**
 * Contrato del Repositorio de Membresías
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Membership.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */
export interface IMembershipRepository {

    /**
     * Crea una membresía.
     */
    create(data: CreateMembershipDto): Promise<any>;

    /**
     * Obtiene todas las membresías.
     */
    findAll(): Promise<any[]>;

    /**
     * Obtiene una membresía por nombre.
     */
    findByUserName(username: string): Promise<any | null>;

   
}