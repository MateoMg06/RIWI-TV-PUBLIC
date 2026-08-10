// app/src/repositories/user.repository.ts

import User, { UserCreationAttributes } from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';
import user from '../services/user.service';

/**
 * Repositorio de Usuarios
 * -----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad User.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class UserRepository implements IUserRepository {
    /**
     * Crea un nuevo usuario.
     */
    async create(data: UserCreationAttributes): Promise<User> {

        return await User.create(data);

    }

    /**
     * Obtiene todos los usuarios.
     */
    async findAll(): Promise<User[]> {

        return await User.findAll();

    }
    
    /**
     * Obtiene uno de los usuarios.
     */
    async findOne(email: string): Promise<User| string>{

        const resposes =  await User.findOne({
            where : {email : email}
        });

        return resposes ? resposes : "no lo encontre";
    }

    


    async findUserCredential(email: string, password: string): Promise<User| string>{

        const resposes =  await User.findUserCredential({
            where : {email : email, password: password}
        });

        return resposes ? resposes : "no lo encontre";
    }

}

export default new UserRepository();
