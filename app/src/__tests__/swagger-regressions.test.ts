import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import membershipService from '../services/membership.service';
import userRepository from '../repositories/user.repository';
import profileRepository from '../repositories/profile.repository';
import membershipRepository from '../repositories/membership.repository';
import emailService from '../services/email.service';
import { createUser, updateUser } from '../controllers/user.controller';
import { createToken } from '../utils/jwt';
import { generateCaptcha } from '../utils/captcha';
import { validateJsonBody } from '../middlewares/validateJsonBody';
import { swaggerSpec } from '../docs/swagger';

const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('regresiones de la auditoría Swagger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('el registro alternativo ignora role y crea perfil y membresía sin devolver el hash', async () => {
    const transaction = { commit: jest.fn(), rollback: jest.fn() };
    jest.spyOn(User.sequelize!, 'transaction').mockResolvedValue(transaction as never);
    jest.spyOn(userRepository, 'findUserCredential').mockResolvedValue(null);
    jest.spyOn(profileRepository, 'findByDocumentNumber').mockResolvedValue(null);
    const create = jest.spyOn(userRepository, 'create').mockResolvedValue({ id: 42 } as any);
    const profile = jest.spyOn(profileRepository, 'create').mockResolvedValue({} as any);
    const membership = jest.spyOn(membershipRepository, 'create').mockResolvedValue({} as any);
    jest.spyOn(emailService, 'isConfigured').mockReturnValue(false);
    const captcha = generateCaptcha();
    const res = response();
    await createUser(
      {
        body: {
          name: 'QA',
          lastName: 'Audit',
          email: 'qa@example.invalid',
          confirmEmail: 'qa@example.invalid',
          password: 'Regression123!',
          confirmPassword: 'Regression123!',
          phone: '3000000000',
          documentType: 'CC',
          documentNumber: '1234567890',
          city: 'Medellín',
          birthDate: '1990-01-01',
          acceptsTerms: true,
          acceptsDataProcessing: true,
          role: 'admin',
          captchaToken: captcha.token,
          captchaAnswer: captcha.answer,
        },
      } as Request,
      res as unknown as Response,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'usuario', accountStatus: 'inactive' }),
      transaction,
    );
    expect(profile).toHaveBeenCalledWith(expect.objectContaining({ userId: 42 }), transaction);
    expect(membership).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 42, bonusWallet: 0 }),
      transaction,
    );
    expect(res.json.mock.calls[0][0]).not.toHaveProperty('password');
    expect(transaction.commit).toHaveBeenCalledTimes(1);
  });

  it('rechaza autenticación antigua de cuentas bloqueadas antes de comparar contraseñas', async () => {
    jest.spyOn(userRepository, 'findUserCredential').mockResolvedValue({
      accountStatus: 'active',
      lockedUntil: new Date(Date.now() + 60000),
    } as any);
    await expect(
      userService.findCredential('qa@example.invalid', 'Regression123!'),
    ).rejects.toMatchObject({ estado: 401 });
  });

  it('emite tokens diferentes incluso dentro del mismo segundo', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-10T12:00:00Z'));
    const tokens = Array.from({ length: 20 }, () =>
      createToken({ id: 1 }, 'secret', { expiresIn: '7d' }),
    );
    expect(new Set(tokens).size).toBe(20);
    expect(jwt.verify(tokens[0]!, 'secret')).toHaveProperty('jti');
  });

  it.each([
    'invalid',
    jwt.sign({ id: 1 }, 'wrong-secret'),
    jwt.sign({ id: 1 }, 'refresh-test', { expiresIn: -1 }),
  ])('rechaza refresh inválido o expirado con 401', async (token) => {
    const previous = process.env.JWT_REFRESH_SECRET;
    process.env.JWT_REFRESH_SECRET = 'refresh-test';
    try {
      await expect(authService.refresh(token, {} as Request)).rejects.toMatchObject({
        estado: 401,
      });
    } finally {
      if (previous === undefined) delete process.env.JWT_REFRESH_SECRET;
      else process.env.JWT_REFRESH_SECRET = previous;
    }
  });

  it.each([undefined, null, [], {}, 'text'])(
    'rechaza cuerpos que no son objetos JSON con datos: %p',
    (body) => {
      const res = response(),
        next = jest.fn();
      validateJsonBody(
        { method: 'POST', path: '/login', body, query: {} } as Request,
        res as unknown as Response,
        next,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, 0, -1, 1.5, '12', 121])(
    'valida duración antes de escribir una membresía: %p',
    async (durationMonths) => {
      const lookup = jest.spyOn(userRepository, 'findByID');
      await expect(
        membershipService.createMembership({ userId: 1, durationMonths } as any),
      ).rejects.toMatchObject({ estado: 400 });
      expect(lookup).not.toHaveBeenCalled();
    },
  );

  it('no modifica el usuario autenticado cuando la URL apunta a otro ID', async () => {
    const update = jest.spyOn(userService, 'updateUser');
    const res = response();
    await updateUser(
      { user: { id: 1 }, params: { id: '2' }, body: { name: 'Changed' } } as unknown as Request,
      res as unknown as Response,
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(update).not.toHaveBeenCalled();
  });

  it('Swagger permite enviar los cuerpos y credenciales que exigen los endpoints', () => {
    const paths = (swaggerSpec as any).paths;
    for (const [url, method] of [
      ['/api/auth/login', 'post'],
      ['/api/auth/refresh', 'post'],
      ['/api/profile', 'put'],
      ['/api/reservations/lock-seats', 'post'],
      ['/api/reservations/release-seats', 'delete'],
      ['/api/notifications/upcoming', 'post'],
      ['/api/users/location', 'post'],
    ]) {
      expect(paths[url!][method!].requestBody.content['application/json'].schema).toBeDefined();
    }
    expect(
      paths['/api/users'].post.requestBody.content['application/json'].schema.required,
    ).toContain('captchaToken');
    expect(paths['/api/users'].get.security).toContainEqual({ bearerAuth: [] });
    expect(
      paths['/api/cinemas/{id}/movies/{movieId}'].post.requestBody.content['application/json']
        .schema.required,
    ).toEqual(['startsAt', 'room', 'price']);
  });
});
