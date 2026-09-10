import User, { UserAttributes } from '../models/user.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import repository from '../repositories/user.repository';
import { IUserService } from './interfaces/user.service.interface';
import ErrorHandler from '../error/errorHandler';
import { validatePassword } from '../utils/password';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import cityRepository from '../repositories/city.repository';
import cinemaRepository from '../repositories/cinema.repository';
import { randomUUID } from 'crypto';

class UserService implements IUserService {
  async findAll(): Promise<User[]> {
    return await repository.findAll();
  }

  async findOne(email: string): Promise<User | null> {
    return await repository.findOne(email);
  }

  async findByID(id: number): Promise<User | null> {
    return await repository.findByID(id);
  }

  async findCredential(email: string, password: string): Promise<User | null> {
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      throw new ErrorHandler(400, 'Correo y contraseña son requeridos');
    }
    const user = await repository.findUserCredential(email);

    if (!user) {
      throw new ErrorHandler(401, 'Correo o contraseña inválidos');
    }

    if (user.accountStatus === 'inactive') {
      throw new ErrorHandler(
        401,
        'Cuenta no activada. Por favor active su cuenta desde el correo enviado.',
      );
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new ErrorHandler(401, 'Cuenta bloqueada temporalmente por múltiples intentos fallidos');
    }
    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      await this.registerFailedAttempt(user);
      throw new ErrorHandler(401, 'Contraseña incorrecta');
    }

    await this.clearAttempts(user);
    return user;
  }

  async registerFailedAttempt(user: User): Promise<void> {
    const now = new Date();
    const lockDuration = 900000;
    const maxAttempts = parseInt(process.env.MAX_FAILED_ATTEMPTS || '5', 10);
    const expiredStreak =
      user.lastLoginAttempt !== null &&
      now.getTime() - user.lastLoginAttempt.getTime() > lockDuration;
    const previousAttempts = expiredStreak ? 0 : user.failedLoginAttempts;
    const updatedAttempts = previousAttempts + 1;

    const data: Partial<UserAttributes> = {
      failedLoginAttempts: updatedAttempts,
      lastLoginAttempt: now,
    };

    if (updatedAttempts >= maxAttempts) {
      data.lockedUntil = new Date(now.getTime() + lockDuration);
    }

    await repository.updateByID(user.id, data);
  }

  async clearAttempts(user: User): Promise<void> {
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await repository.updateByID(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAttempt: null,
      });
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User | null> {
    const user = await repository.findByID(id);
    if (!user) throw new ErrorHandler(404, 'Usuario no encontrado');

    const data: Partial<UserAttributes> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.email !== undefined) {
      const existingUser = await repository.findUserCredential(dto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ErrorHandler(409, 'Este correo ya está vinculado a un usuario');
      }
      data.email = dto.email;
      data.accountStatus = 'inactive';
      data.activationToken = randomUUID();
      data.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    if (dto.password !== undefined) {
      const validPassword = await validatePassword(dto.password);
      if (!validPassword) {
        throw new ErrorHandler(
          400,
          'Contraseña inválida, aségurese de que cumpla con los requerimientos de contraseña',
        );
      }
      const saltRounds = Number(process.env.SALT_ROUNDS || 10);
      data.password = await hashPassword(dto.password, saltRounds);
    }

    if (dto.phone !== undefined) {
      if (!/^\d{10}$/.test(dto.phone)) {
        throw new ErrorHandler(400, 'El número de teléfono debe contener exactamente 10 dígitos');
      }
      data.phone = dto.phone;
    }

    if (dto.documentType !== undefined) data.documentType = dto.documentType;
    if (dto.documentNumber !== undefined) data.documentNumber = dto.documentNumber;
    if (dto.birthDate !== undefined) {
      const birthDate = new Date(dto.birthDate);
      if (isNaN(birthDate.getTime())) {
        throw new ErrorHandler(400, 'La fecha de nacimiento no es válida');
      }
      data.birthDate = birthDate;
    }
    if (dto.city !== undefined) data.city = dto.city;
    if (dto.acceptsDataProcessing !== undefined)
      data.acceptsDataProcessing = dto.acceptsDataProcessing;
    if (dto.acceptsTerms !== undefined) data.acceptsTerms = dto.acceptsTerms;
    if (dto.acceptsNotifications !== undefined)
      data.acceptsNotifications = dto.acceptsNotifications;

    if (Object.keys(data).length === 0) {
      throw new ErrorHandler(400, 'No se proporcionaron datos para actualizar');
    }
    await repository.updateByID(id, data);
    return (await repository.findByID(id)) as User;
  }

  async setLocation(userId: number, cityId: number): Promise<User> {
    const user = await repository.findByID(userId);
    if (!user) throw new ErrorHandler(404, 'Usuario no encontrado');
    const city = await cityRepository.findByPk(cityId);
    if (!city) throw new ErrorHandler(404, 'Ciudad no encontrada');
    if (!city.active) throw new ErrorHandler(422, 'La ciudad está inactiva');
    if ((await cinemaRepository.countActiveByCityId(cityId)) === 0) {
      throw new ErrorHandler(422, 'La ciudad no tiene cines activos');
    }
    await repository.updateByID(userId, { cityId, city: city.city });
    return (await repository.findByID(userId))!;
  }
}

export default new UserService();
