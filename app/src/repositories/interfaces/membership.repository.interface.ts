// app/src/repositories/interfaces/membership.repository.interface.ts

import { CreateTypeMembershipDto } from "../../dto/create-typeMembership.dto";
import Membership, { MembershipAttributes, MembershipCreationAttributes } from '../../models/membership.model';
import { Transaction } from 'sequelize';

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
    create(data: CreateTypeMembershipDto | MembershipCreationAttributes, transaction?: Transaction): Promise<any>;

    /**
     * Obtiene todas las membresías.
     */
    findAll(): Promise<any[]>;

    /**
     * Obtiene una membresía por nombre.
     */
    findByUserName(username: string): Promise<any | null>;

    /**
     * Obtiene una membresía por ID de usuario.
     */
    findByUserId(userId: number): Promise<Membership | null>;

    /**
     * Obtiene una membresía por código.
     */
    findByCode(code: string): Promise<Membership | null>;

    /**
     * Actualiza una membresía por ID de usuario.
     */
    updateByUserId(userId: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null>;

    /**
     * Actualiza una membresía por ID.
     */
    updateById(id: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null>;
}
