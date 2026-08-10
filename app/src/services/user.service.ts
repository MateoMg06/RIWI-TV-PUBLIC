import User from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import repository from '../repositories/user.repository';
import { IUserService } from './interfaces/user.service.interface';
import errorhandler from '../error/errorHandler';

class UserService implements IUserService {
  async create(dto: CreateUserDto): Promise<User> {
    return await repository.create(dto);
  }

  async findAll(): Promise<User[]> {
    return await repository.findAll();
  }

  async findOne(email: string): Promise<User | null> {
    return await repository.findOne(email);
  }

  async findCredential(email: string, password: string): Promise<User | null> {
    const user = await repository.findUserCredential(email, password);

    if (!user) {
      throw new errorhandler(401, 'Correo o contraseña inválidos');
    }

    if (user.password !== password) {
      throw new errorhandler(401, 'Credenciales inválidas');
    }

    return user;
  }
}

export default new UserService();