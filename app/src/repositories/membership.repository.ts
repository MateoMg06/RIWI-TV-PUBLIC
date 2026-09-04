// app/src/repositories/membership.repository.ts

import Membership, { MembershipCreationAttributes, MembershipAttributes } from '../models/membership.model';
import User from '../models/user.model';
import { IMembershipRepository } from './interfaces/membership.repository.interface';
import { Transaction } from 'sequelize';

/**
 * Repositorio de Membresías
 * -----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Membership.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */
class MembershipRepository implements IMembershipRepository {

    /**
     * Crea una nueva membresía.
     */
    async create(data: MembershipCreationAttributes, transaction?: Transaction): Promise<Membership> {
        return await Membership.create(data, { transaction });
    }

    /**
     * Obtiene todas las membresías.
     */
    async findAll() {
        return await Membership.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ]
        });
    }

    /**
     * Obtiene una membresía por nombre.
     */
    async findByUserName(name: string){
        return await Membership.findOne({
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        });
    }

    /**
     * Obtiene una membresía por ID de usuario.
     */
    async findByUserId(userId: number): Promise<Membership | null> {
        return await Membership.findOne({ where: { userId } });
    }

    /**
     * Obtiene una membresía por código.
     */
    async findByCode(code: string): Promise<Membership | null> {
        return await Membership.findOne({ where: { code } });
    }

    /**
     * Actualiza una membresía por ID de usuario.
     */
    async updateByUserId(userId: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null> {
        const membership = await Membership.findOne({ where: { userId } });
        if (!membership) return null;
        await membership.update(data, { transaction });
        return membership;
    }

    /**
     * Actualiza una membresía por ID.
     */
    async updateById(id: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null> {
        const membership = await Membership.findByPk(id);
        if (!membership) return null;
        await membership.update(data, { transaction });
        return membership;
    }
}


export default new MembershipRepository();
