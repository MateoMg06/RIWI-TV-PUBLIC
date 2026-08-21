// app/src/repositories/membership.repository.ts

import Membership, { MembershipCreationAttributes } from '../models/membership.model';
import { IMembershipRepository } from './interfaces/membership.repository.interface';

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
    async create(data: MembershipCreationAttributes): Promise<Membership> {
        return await Membership.create(data);
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
                {
                    model: Qr,
                    as: 'qr',
                }
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
                {
                    model: Qr,
                    as: 'qr',
                },
            ],
            
        });
    }

   


}


export default new MembershipRepository();