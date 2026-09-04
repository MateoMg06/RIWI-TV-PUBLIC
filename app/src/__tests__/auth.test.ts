jest.mock('../models', () => ({}));
jest.mock('../services/auth.service');
jest.mock('../controllers/movie.controller', () => {
  const fn = () => {};
  const ctrl = {
    create: fn,
    getCatalog: fn,
    getByName: fn,
    getMovieCinemas: fn,
    getWeeklyMovies: fn,
    getTodayMovies: fn,
    getFilteredMovies: fn,
  };
  return { __esModule: true, ...ctrl, default: ctrl };
});
jest.mock('../middlewares/authToken', () => ({
  authToken: jest.fn((req: any, _res: any, next: any) => {
    req.user = { id: 1, role: 'admin', name: 'Test' };
    next();
  }),
}));
jest.mock('../middlewares/requireRole', () => ({
  __esModule: true,
  default: jest.fn(() => (req: any, _res: any, next: any) => next()),
}));
jest.mock('swagger-ui-express', () => ({
  serve: [(req: any, res: any, next: any) => next()],
  setup: () => (req: any, res: any, next: any) => next(),
}));
jest.mock('../docs/swagger', () => ({ swaggerSpec: {} }));

import request from 'supertest';
import app from '../server';
import authService from '../services/auth.service';
import errorhandler from '../error/errorHandler';

const mockAuthService = jest.mocked(authService);

describe('Auth Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/auth/captcha', () => {
    it('debe retornar 200 con el captcha', async () => {
      mockAuthService.getCaptcha.mockResolvedValue({ token: 'abc123', question: '2 + 3' });
      const res = await request(app).get('/api/auth/captcha');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ token: 'abc123', question: '2 + 3' });
    });

    it('debe retornar 500 si el service lanza un error', async () => {
      mockAuthService.getCaptcha.mockRejectedValue(new Error('Error interno'));
      const res = await request(app).get('/api/auth/captcha');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/register', () => {
    it('debe retornar 201 al registrar un usuario', async () => {
      mockAuthService.register.mockResolvedValue({ message: 'Registro exitoso', userId: 1 });
      const res = await request(app).post('/api/auth/register').send({ name: 'John', email: 'john@test.com' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
    });

    it('debe retornar el código de error cuando el service lanza errorhandler', async () => {
      const error = new errorhandler(409, 'Correo ya registrado');
      mockAuthService.register.mockRejectedValue(error);
      const res = await request(app).post('/api/auth/register').send({ email: 'dup@test.com' });
      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Correo ya registrado' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/activate', () => {
    it('debe retornar 200 al activar la cuenta', async () => {
      mockAuthService.activateAccount.mockResolvedValue({ message: 'Cuenta activada' });
      const res = await request(app).post('/api/auth/activate').send({ token: 'valid-token' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('debe retornar 400 para token inválido', async () => {
      const error = new errorhandler(400, 'Token inválido');
      mockAuthService.activateAccount.mockRejectedValue(error);
      const res = await request(app).post('/api/auth/activate').send({ token: 'bad' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.activateAccount.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/auth/activate').send({ token: 'x' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('debe retornar 200 al solicitar recuperación', async () => {
      mockAuthService.forgotPassword.mockResolvedValue({ message: 'Correo enviado' });
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'user@test.com' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('debe retornar 400 cuando la cuenta no está activa', async () => {
      const error = new errorhandler(400, 'Cuenta no activada');
      mockAuthService.forgotPassword.mockRejectedValue(error);
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'x' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.forgotPassword.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'x' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('debe retornar 200 al restablecer la contraseña', async () => {
      mockAuthService.resetPassword.mockResolvedValue({ message: 'Contraseña restablecida' });
      const res = await request(app).post('/api/auth/reset-password').send({ token: 'reset', password: 'NewPass123!', confirmPassword: 'NewPass123!' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('debe retornar 400 para token inválido', async () => {
      const error = new errorhandler(400, 'Token expirado');
      mockAuthService.resetPassword.mockRejectedValue(error);
      const res = await request(app).post('/api/auth/reset-password').send({ token: 'expired' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.resetPassword.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/auth/reset-password').send({});
      expect(res.status).toBe(500);
    });
  });
});
