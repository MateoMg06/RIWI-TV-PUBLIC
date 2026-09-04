import User from '../models/user.model';
import Profile from '../models/profile.model';
import Membership from '../models/membership.model';
import { RegisterDto } from '../dto/register.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import userRepository from '../repositories/user.repository';
import profileRepository from '../repositories/profile.repository';
import membershipRepository from '../repositories/membership.repository';
import passwordResetTokenRepository from '../repositories/password-reset-token.repository';
import refreshTokenRepository from '../repositories/refresh-token.repository';
import accessAuditRepository from '../repositories/access-audit.repository';
import { validatePassword } from '../utils/password';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateCaptcha, verifyCaptcha } from '../utils/captcha';
import { createToken, verifyToken } from '../utils/jwt';
import emailService from './email.service';
import ErrorHandler from '../error/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';
import type { Request } from 'express';
import { AuthPayload } from '../types/index.d';
import { getClientIp, getDeviceInfo, getUserAgent } from '../helpers/device-info';
import { calculateExpiryDate } from '../utils/token-expiry';
import { IAuthService } from './interfaces/auth.service.interface';

class AuthService implements IAuthService {
  async getCaptcha(): Promise<{ token: string; question: string }> {
    const captcha = generateCaptcha();
    return {
      token: captcha.token,
      question: captcha.question,
    };
  }

  async register(dto: RegisterDto): Promise<{ message: string; userId: number }> {
    if (!verifyCaptcha(dto.captchaToken, dto.captchaAnswer)) {
      throw new ErrorHandler(400, 'Respuesta de CAPTCHA incorrecta');
    }

    if (dto.email !== dto.confirmEmail) {
      throw new ErrorHandler(400, 'El correo y su confirmación no coinciden');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new ErrorHandler(400, 'La contraseña y su confirmación no coinciden');
    }

    const validPassword = await validatePassword(dto.password);
    if (!validPassword) {
      throw new ErrorHandler(400, 'Contraseña inválida, asegúrese de que cumpla con los requerimientos de contraseña');
    }

    // Validar teléfono (10 dígitos exactos)
    if (!/^\d{10}$/.test(dto.phone)) {
      throw new ErrorHandler(400, 'El número de teléfono debe contener exactamente 10 dígitos');
    }

    if (!dto.acceptsDataProcessing) {
      throw new ErrorHandler(400, 'Debe aceptar el tratamiento de datos personales para continuar');
    }

    if (!dto.acceptsTerms) {
      throw new ErrorHandler(400, 'Debe aceptar los términos y condiciones para continuar');
    }

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findUserCredential(dto.email);
    if (existingUser) {
      throw new ErrorHandler(409, 'El usuario ya existe');
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
      throw new ErrorHandler(400, 'Token de activación inválido');
    }

    if (userToActivate.activationTokenExpires && userToActivate.activationTokenExpires < new Date()) {
      throw new ErrorHandler(400, 'El token de activación ha expirado');
    }

    if (userToActivate.accountStatus === 'active') {
      throw new ErrorHandler(400, 'La cuenta ya está activada');
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

  async forgotPassword(dto: ForgotPasswordDto, req: Request): Promise<{ message: string }> {
    const user = await userRepository.findUserCredential(dto.email);

    if (!user) {
      // No revelar si el email existe o no por seguridad
      return { message: 'Si el correo está registrado, se enviará un enlace de recuperación.' };
    }

    if (user.accountStatus === 'inactive') {
      throw new ErrorHandler(400, 'La cuenta no está activada. Por favor active su cuenta desde el correo enviado.');
    }

    // Generar token de recuperación (válido según RESET_TOKEN_EXPIRES_IN)
    const resetToken = uuidv4();
    const resetTokenExpires = calculateExpiryDate(
      process.env.RESET_TOKEN_EXPIRES_IN || '1h',
      60 * 60 * 1000
    );

    // Invalidar tokens anteriores de recuperación
    await passwordResetTokenRepository.invalidateByUserId(user.id);

    // Guardar token en la base de datos
    await passwordResetTokenRepository.create({
      userId: user.id,
      token: resetToken,
      expiresAt: resetTokenExpires,
      used: false,
    });

    // También guardar en el usuario para compatibilidad
    await userRepository.updateByID(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // Registrar auditoría
    await this.logAccessAudit({
      userId: user.id,
      action: 'password_reset_requested',
      success: true,
      req,
      details: 'Solicitud de recuperación de contraseña',
    });

    // Enviar correo (no fallar si hay error de correo)
    try {
      await emailService.sendForgotPasswordEmail(dto.email, resetToken, user.name);
    } catch (emailError) {
      console.error('Error sending forgot password email:', emailError);
    }

    return { message: 'Si el correo está registrado, se enviará un enlace de recuperación.' };
  }

  async resetPassword(dto: ResetPasswordDto, req: Request): Promise<{ message: string }> {
    if (dto.password !== dto.confirmPassword) {
      throw new ErrorHandler(400, 'La contraseña y su confirmación no coinciden');
    }

    const validPassword = await validatePassword(dto.password);
    if (!validPassword) {
      throw new ErrorHandler(400, 'Contraseña inválida, asegúrese de que cumpla con los requerimientos de contraseña');
    }

    // Buscar token de recuperación
    const resetTokenRecord = await passwordResetTokenRepository.findByToken(dto.token);

    if (!resetTokenRecord) {
      throw new ErrorHandler(400, 'Token de recuperación inválido');
    }

    if (resetTokenRecord.used) {
      throw new ErrorHandler(400, 'El token de recuperación ya ha sido utilizado');
    }

    if (resetTokenRecord.expiresAt < new Date()) {
      throw new ErrorHandler(400, 'El token de recuperación ha expirado');
    }

    const user = await userRepository.findByID(resetTokenRecord.userId);
    if (!user) {
      throw new ErrorHandler(404, 'Usuario no encontrado');
    }

    // Hashear la nueva contraseña
    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const hashedPassword = await hashPassword(dto.password, saltRounds);

    // Actualizar contraseña y limpiar tokens
    await userRepository.updateByID(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
      accessToken: null,
      refreshToken: null,
    });

    // Marcar token como usado
    await passwordResetTokenRepository.markAsUsed(dto.token);

    // Registrar auditoría
    await this.logAccessAudit({
      userId: user.id,
      action: 'password_reset',
      success: true,
      req,
      details: 'Contraseña restablecida exitosamente',
    });

    return { message: 'Contraseña restablecida exitosamente. Ya puede iniciar sesión.' };
  }

  /**
   * Registra un evento de auditoría de acceso en la base de datos.
   */
  async logAccessAudit(params: {
    userId: number | null;
    action: 'login' | 'login_failed' | 'refresh' | 'logout' | 'password_reset_requested' | 'password_reset' | 'account_activated';
    success: boolean;
    req: Request;
    details?: string;
  }): Promise<void> {
    const ipAddress = getClientIp(params.req);
    const device = getDeviceInfo(params.req);
    const userAgent = getUserAgent(params.req);

    await accessAuditRepository.create({
      userId: params.userId,
      action: params.action,
      ipAddress,
      device,
      userAgent,
      success: params.success,
      details: params.details || null,
    });
  }

  /**
   * Inicia sesión: valida credenciales, genera tokens, invalida refresh tokens
   * anteriores, guarda el accessToken en la DB, registra IP/dispositivo y
   * guarda auditoría de acceso.
   */
  async login(email: string, password: string, req: Request): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { role: string; id: number; name: string; membership: string };
  }> {
    const user = await userRepository.findUserCredential(email);

    if (!user) {
      await this.logAccessAudit({
        userId: null,
        action: 'login_failed',
        success: false,
        req,
        details: `Intento de login con email no registrado: ${email}`,
      });
      throw new ErrorHandler(401, 'Credenciales inválidas');
    }

    if (user.accountStatus === 'inactive') {
      await this.logAccessAudit({
        userId: user.id,
        action: 'login_failed',
        success: false,
        req,
        details: 'Cuenta inactiva',
      });
      throw new ErrorHandler(401, 'Cuenta no activada. Por favor active su cuenta desde el correo enviado.');
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      await this.logAccessAudit({
        userId: user.id,
        action: 'login_failed',
        success: false,
        req,
        details: 'Cuenta bloqueada temporalmente',
      });
      throw new ErrorHandler(401, 'Cuenta bloqueada temporalmente por múltiples intentos fallidos, inténtelo nuevamente en unos minutos');
    }

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      await this.registerFailedAttempt(user);
      await this.logAccessAudit({
        userId: user.id,
        action: 'login_failed',
        success: false,
        req,
        details: 'Contraseña incorrecta',
      });
      throw new ErrorHandler(401, 'Credenciales inválidas');
    }

    // Limpiar intentos fallidos
    await this.clearAttempts(user);

    const payload = {
      role: user.role,
      id: user.id,
      name: user.name,
      membership: user.membership,
    };

    const accessToken = createToken(payload, String(process.env.JWT_SECRET), { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any });
    const refreshToken = createToken(payload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any });

    // Guardar accessToken en la DB
    await userRepository.saveAccessToken(user.id, accessToken);

    // Invalidar refresh tokens anteriores
    await refreshTokenRepository.revokeByUserId(user.id);
    await userRepository.saveRefreshToken(user.id, refreshToken);

    // Guardar refresh token en la tabla de refresh_tokens
    const ipAddress = getClientIp(req);
    const device = getDeviceInfo(req);
    const userAgent = getUserAgent(req);
    const refreshTokenExpires = calculateExpiryDate(
      process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      7 * 24 * 60 * 60 * 1000
    );

    await refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      ipAddress,
      device,
      userAgent,
      expiresAt: refreshTokenExpires,
      revoked: false,
    });

    // Registrar auditoría de acceso
    await this.logAccessAudit({
      userId: user.id,
      action: 'login',
      success: true,
      req,
      details: 'Login exitoso',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        role: payload.role,
        id: payload.id,
        name: payload.name,
        membership: payload.membership,
      },
    };
  }

  /**
   * Refresca el access token: rota el refresh token, invalida el anterior,
   * guarda el nuevo accessToken en la DB y registra auditoría.
   */
  async refresh(refreshToken: string, req: Request): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyToken(refreshToken, String(process.env.JWT_REFRESH_SECRET)) as AuthPayload;

    if (!payload) {
      throw new ErrorHandler(401, 'Token inválido');
    }

    // Verificar que el refresh token no esté revocado
    const storedToken = await refreshTokenRepository.findByToken(refreshToken);
    if (!storedToken || storedToken.revoked) {
      throw new ErrorHandler(401, 'Refresh token inválido o revocado');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new ErrorHandler(401, 'Refresh token expirado');
    }

    const user = await userRepository.findByID(storedToken.userId);
    if (!user) {
      throw new ErrorHandler(401, 'Usuario no encontrado');
    }

    const newPayload = {
      role: payload.role,
      id: payload.id,
      name: payload.name,
      membership: payload.membership,
    };

    const newAccessToken = createToken(newPayload, String(process.env.JWT_SECRET), { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any });
    const newRefreshToken = createToken(newPayload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any });

    // Guardar nuevo accessToken en la DB
    await userRepository.saveAccessToken(user.id, newAccessToken);

    // Invalidar refresh token anterior (rotación)
    await refreshTokenRepository.revokeByToken(refreshToken);
    await userRepository.saveRefreshToken(user.id, newRefreshToken);

    // Guardar nuevo refresh token en la tabla
    const ipAddress = getClientIp(req);
    const device = getDeviceInfo(req);
    const userAgent = getUserAgent(req);
    const newRefreshTokenExpires = calculateExpiryDate(
      process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      7 * 24 * 60 * 60 * 1000
    );

    await refreshTokenRepository.create({
      userId: user.id,
      token: newRefreshToken,
      ipAddress,
      device,
      userAgent,
      expiresAt: newRefreshTokenExpires,
      revoked: false,
    });

    // Registrar auditoría
    await this.logAccessAudit({
      userId: user.id,
      action: 'refresh',
      success: true,
      req,
      details: 'Refresh token rotado exitosamente',
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Cierra sesión: invalida todos los refresh tokens del usuario,
   * limpia el accessToken de la DB, elimina la cookie y registra auditoría.
   */
  async logout(userId: number | null, req: Request): Promise<{ message: string }> {
    if (userId) {
      // Invalidar todos los refresh tokens del usuario
      await refreshTokenRepository.revokeByUserId(userId);
      await refreshTokenRepository.deleteByUserId(userId);

      // Limpiar tokens de la DB del usuario
      await userRepository.clearTokens(userId);
    }

    // Registrar auditoría
    await this.logAccessAudit({
      userId: userId || null,
      action: 'logout',
      success: true,
      req,
      details: 'Sesión cerrada correctamente',
    });

    return { message: 'Sesión cerrada correctamente' };
  }

  private async registerFailedAttempt(user: User): Promise<void> {
    const now = new Date();
    const lockDuration = 900000; // 15 minutos
    const maxAttempts = parseInt(process.env.MAX_FAILED_ATTEMPTS || '5', 10);
    const expiredStreak = user.lastLoginAttempt !== null && now.getTime() - user.lastLoginAttempt.getTime() > lockDuration;
    const previousAttempts = expiredStreak ? 0 : user.failedLoginAttempts;
    const updatedAttempts = previousAttempts + 1;

    const data: Partial<User> = {
      failedLoginAttempts: updatedAttempts,
      lastLoginAttempt: now,
    };

    if (updatedAttempts >= maxAttempts) {
      data.lockedUntil = new Date(now.getTime() + lockDuration);
    }

    await userRepository.updateByID(user.id, data);
  }

  private async clearAttempts(user: User): Promise<void> {
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await userRepository.updateByID(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAttempt: null,
      });
    }
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
