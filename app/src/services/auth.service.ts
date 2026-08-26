import User from '../models/user.model';
import Profile from '../models/profile.model';
import Membership from '../models/membership.model';
import { RegisterDto } from '../dto/register.dto';
import userRepository from '../repositories/user.repository';
import profileRepository from '../repositories/profile.repository';
import membershipRepository from '../repositories/membership.repository';
import { validatePassword } from '../utils/password';
import { hashPassword } from '../utils/bcrypt';
import { generateCaptcha, verifyCaptcha } from '../utils/captcha';
import emailService from './email.service';
import errorhandler from '../error/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';

class AuthService {
  async getCaptcha(): Promise<{ token: string; question: string }> {
    const captcha = generateCaptcha();
    return {
      token: captcha.token,
      question: captcha.question,
    };
  }

  async register(dto: RegisterDto): Promise<{ message: string; userId: number }> {
    if (!verifyCaptcha(dto.captchaToken, dto.captchaAnswer)) {
      throw new errorhandler(400, 'Respuesta de CAPTCHA incorrecta');
    }

    if (dto.email !== dto.confirmEmail) {
      throw new errorhandler(400, 'El correo y su confirmación no coinciden');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new errorhandler(400, 'La contraseña y su confirmación no coinciden');
    }

    const validPassword = await validatePassword(dto.password);
    if (!validPassword) {
      throw new errorhandler(400, 'Contraseña inválida, asegúrese de que cumpla con los requerimientos de contraseña');
    }

    // Validar teléfono (10 dígitos exactos)
    if (!/^\d{10}$/.test(dto.phone)) {
      throw new errorhandler(400, 'El número de teléfono debe contener exactamente 10 dígitos');
    }

    if (!dto.acceptsDataProcessing) {
      throw new errorhandler(400, 'Debe aceptar el tratamiento de datos personales para continuar');
    }

    if (!dto.acceptsTerms) {
      throw new errorhandler(400, 'Debe aceptar los términos y condiciones para continuar');
    }

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findUserCredential(dto.email);
    if (existingUser) {
      throw new errorhandler(409, 'El usuario ya existe');
    }

    // Generar token de activación (válido por 24 horas)
    const activationToken = uuidv4();
    const activationTokenExpires = new Date();
    activationTokenExpires.setHours(activationTokenExpires.getHours() + 24);

    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const hashedPassword = await hashPassword(dto.password, saltRounds);

    // Crear transacción
    const transaction = await User.sequelize?.transaction();

    try {
      // 1. Crear usuario
      const user = await userRepository.create({
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        birthDate: new Date(dto.birthDate),
        city: dto.city,
        acceptsDataProcessing: dto.acceptsDataProcessing,
        acceptsTerms: dto.acceptsTerms,
        acceptsNotifications: dto.acceptsNotifications,
        accountStatus: 'inactive',
        activationToken,
        activationTokenExpires,
        role: 'usuario',
        membership: 'básica',
        failedLoginAttempts: 0,
        lastLoginAttempt: null,
        lockedUntil: null,
      } as any, transaction);

      if (!user) {
        throw new Error('Error al crear el usuario');
      }

      // 2. Crear perfil
      await profileRepository.create({
        userId: user.id,
        lastName: dto.lastName,
        phone: dto.phone,
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        birthDate: new Date(dto.birthDate),
        city: dto.city,
        address: dto.address,
        avatar: dto.avatar,
      }, transaction);

      // 3. Crear membresía inicial
      const membershipCode = this.generateMembershipCode();
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 mes de prueba

      await membershipRepository.create({
        userId: user.id,
        code: membershipCode,
        status: 'pending',
        startDate: now,
        endDate: endDate,
        bonusWallet: 0,
      }, transaction);

      // Confirmar transacción
      await transaction?.commit();

      // Enviar correo de activación (fuera de la transacción)
      try {
        await emailService.sendActivationEmail(dto.email, activationToken, dto.name);
      } catch (emailError) {
        console.error('Error sending activation email:', emailError);
        // No fallar el registro por error de correo
      }

      return {
        message: 'Usuario registrado exitosamente. Por favor active su cuenta desde el correo enviado.',
        userId: user.id,
      };
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async activateAccount(token: string): Promise<{ message: string }> {
    // Buscar usuario por token de activación
    const userToActivate = await userRepository.findByActivationToken(token);

    if (!userToActivate) {
      throw new errorhandler(400, 'Token de activación inválido');
    }

    if (userToActivate.activationTokenExpires && userToActivate.activationTokenExpires < new Date()) {
      throw new errorhandler(400, 'El token de activación ha expirado');
    }

    if (userToActivate.accountStatus === 'active') {
      throw new errorhandler(400, 'La cuenta ya está activada');
    }

    // Activar cuenta
    await userRepository.updateByID(userToActivate.id, {
      accountStatus: 'active',
      activationToken: null,
      activationTokenExpires: null,
    });

    // Activar membresía
    await membershipRepository.updateByUserId(userToActivate.id, {
      status: 'active',
    });

    return { message: 'Cuenta activada exitosamente. Ya puede iniciar sesión.' };
  }

  private generateMembershipCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'MEM-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export default new AuthService();
