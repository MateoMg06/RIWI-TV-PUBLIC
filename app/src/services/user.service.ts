import User from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import repository from '../repositories/user.repository';
import { IUserService } from './interfaces/user.service.interface';
import errorhandler from '../error/errorHandler';
import { comparePassword, hashPassword } from '../utils/bcrypt';

class UserService implements IUserService {
  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await repository.findUserCredential(dto.email);
    if (existingUser) {
      throw new errorhandler(409, 'El usuario ya existe');
    }

    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const userPayload = {
      ...dto,
      password: await hashPassword(dto.password, saltRounds),
      role: dto.role || 'usuario',
    } as any;

    return await repository.create(userPayload);
  }

  async findAll(): Promise<User[]> {
    return await repository.findAll();
  }

  async findOne(email: string): Promise<User | null> {
    return await repository.findOne(email);
  }

  async findCredential(email: string, password: string): Promise<User | null> {
    const user = await repository.findUserCredential(email);

    if (!user) {
      throw new errorhandler(401, 'Correo o contraseña inválidos');
    }

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      throw new errorhandler(401, 'Credenciales inválidas');
    }

    return user;
  }

  // async verifyAttempts(email: string): Promise<boolean>{
  //   const user= await repository.findUserCredential(email)
  //   const attempts: number= user?.failedLoginAttempts ? user?.failedLoginAttempts : 0
  //   if (attempts >= 5){
  //     throw new errorhandler(401, 'Acceso no autorizado');
  //   }
  //   return isValid
  // }
}

export default new UserService();