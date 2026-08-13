import User, { UserAttributes } from '../models/user.model';
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
      await this.registerFailedAttempt(user)
      throw new errorhandler(401, 'Contraseña incorrecta');
    }

    return user;
  }

  async registerFailedAttempt(user: User): Promise<void>{
    const now= new Date()
    const lockDuration= parseInt(process.env.LOCK_DURATION_MS || String(15 * 60 * 1000), 10)
    const maxAttempts= parseInt(process.env.MAX_FAILED_ATTEMPTS || "5", 10)
    const expiredStreak= user.lastLoginAttempt !== null && now.getTime() - user.lastLoginAttempt.getTime() > lockDuration
    const previousAttempts= expiredStreak? user.failedLoginAttempts : 0;
    const updatedAttempts = previousAttempts + 1;
 
    const data: Partial<UserAttributes> = {
      failedLoginAttempts: updatedAttempts,
      lastLoginAttempt: now,
    };
 
    if (updatedAttempts >= maxAttempts) {
      data.lockedUntil = new Date(now.getTime() + lockDuration);
    }
 
    await repository.updateByID(user.id, data)
  }

  async clearAttempts(user: User): Promise<void>{
    if(user.failedLoginAttempts > 0 || user.lockedUntil){
      await repository.updateByID(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAttempt: null
      })
    }
  }

}

export default new UserService();