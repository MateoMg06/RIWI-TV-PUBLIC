import User, { UserAttributes } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import repository from '../repositories/user.repository';
import { IUserService } from './interfaces/user.service.interface';
import errorhandler from '../error/errorHandler';
import { validatePassword } from '../utils/password';
import { comparePassword, hashPassword } from '../utils/bcrypt';

class UserService implements IUserService {
  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await repository.findUserCredential(dto.email);
    if (existingUser) {
      throw new errorhandler(409, 'El usuario ya existe');
    }

    // Validar confirmación de correo
    if (dto.email !== dto.confirmEmail) {
      throw new errorhandler(400, 'El correo y su confirmación no coinciden');
    }

    // Validar confirmación de contraseña
    if (dto.password !== dto.confirmPassword) {
      throw new errorhandler(400, 'La contraseña y su confirmación no coinciden');
    }

    const validPassword = await validatePassword(dto.password);
    if (!validPassword) {
      throw new errorhandler(400, 'Contraseña inválida, aségurese de que cumpla con los requerimientos de contraseña')
    }

    // Validar número de teléfono (10 caracteres exactos)
    if (!/^\d{10}$/.test(dto.phone)) {
      throw new errorhandler(400, 'El número de teléfono debe contener exactamente 10 dígitos');
    }

    // Validar aceptación de términos y tratamiento de datos
    if (!dto.acceptsDataProcessing) {
      throw new errorhandler(400, 'Debe aceptar el tratamiento de datos personales para continuar');
    }

    if (!dto.acceptsTerms) {
      throw new errorhandler(400, 'Debe aceptar los términos y condiciones para continuar');
    }

    // Validar fecha de nacimiento
    const birthDate = new Date(dto.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new errorhandler(400, 'La fecha de nacimiento no es válida');
    }

    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const { confirmEmail, confirmPassword, ...userData } = dto;
    const userPayload = {
      ...userData,
      birthDate,
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

  async findByID(id: number): Promise<User | null> {
    return await repository.findByID(id)
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

  async registerFailedAttempt(user: User): Promise<void> {
    const now = new Date()
    const lockDuration = 900000
    const maxAttempts = parseInt(process.env.MAX_FAILED_ATTEMPTS || "5", 10)
    const expiredStreak = user.lastLoginAttempt !== null && now.getTime() - user.lastLoginAttempt.getTime() > lockDuration
    const previousAttempts = expiredStreak ? 0 : user.failedLoginAttempts
    const updatedAttempts = previousAttempts + 1

    const data: Partial<UserAttributes> = {
      failedLoginAttempts: updatedAttempts,
      lastLoginAttempt: now,
    };

    if (updatedAttempts >= maxAttempts) {
      data.lockedUntil = new Date(now.getTime() + lockDuration)
    }

    await repository.updateByID(user.id, data)
  }

  async clearAttempts(user: User): Promise<void> {
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await repository.updateByID(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAttempt: null
      })
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User | null> {
    const user = await repository.findByID(id)
    if (!user) throw new errorhandler(404, "Usuario no encontrado")

    const data: Partial<UserAttributes> = {}
    if (dto.name !== undefined) data.name = dto.name
    if (dto.lastName !== undefined) data.lastName = dto.lastName
    if (dto.email !== undefined) {
      const existingUser = await repository.findUserCredential(dto.email);
      if (existingUser) {
        throw new errorhandler(409, 'Este correo ya está vinculado a un usuario');
      }
      data.email = dto.email
    }

    if (dto.password !== undefined) {
      const validPassword = await validatePassword(dto.password)
      if (!validPassword) {
        throw new errorhandler(400, 'Contraseña inválida, aségurese de que cumpla con los requerimientos de contraseña')
      }
      const saltRounds = Number(process.env.SALT_ROUNDS || 10)
      data.password = await hashPassword(dto.password, saltRounds)
    }

    if (dto.phone !== undefined) {
      if (!/^\d{10}$/.test(dto.phone)) {
        throw new errorhandler(400, 'El número de teléfono debe contener exactamente 10 dígitos');
      }
      data.phone = dto.phone
    }

    if (dto.documentType !== undefined) data.documentType = dto.documentType
    if (dto.documentNumber !== undefined) data.documentNumber = dto.documentNumber
    if (dto.birthDate !== undefined) {
      const birthDate = new Date(dto.birthDate)
      if (isNaN(birthDate.getTime())) {
        throw new errorhandler(400, 'La fecha de nacimiento no es válida');
      }
      data.birthDate = birthDate
    }
    if (dto.city !== undefined) data.city = dto.city
    if (dto.acceptsDataProcessing !== undefined) data.acceptsDataProcessing = dto.acceptsDataProcessing
    if (dto.acceptsTerms !== undefined) data.acceptsTerms = dto.acceptsTerms
    if (dto.acceptsNotifications !== undefined) data.acceptsNotifications = dto.acceptsNotifications

    if (Object.keys(data).length === 0) {
      throw new errorhandler(400, "No se proporcionaron datos para actualizar")
    }
    await repository.updateByID(id, data)
    return await repository.findByID(id) as User
  }
}

export default new UserService();
