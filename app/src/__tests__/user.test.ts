jest.mock('../models', () => ({}));
jest.mock('../services/user.service');
jest.mock('../services/auth.service');
jest.mock('../config/cookie', () => ({
  cookieOptions: { httpOnly: true, maxAge: 3600000 },
}));
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
    req.user = { id: 1, role: 'admin', name: 'Test', membership: 'premium' };
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
import userService from '../services/user.service';
import errorhandler from '../error/errorHandler';
import authService from '../services/auth.service';

const mockUserService = jest.mocked(userService);
const mockAuthService = jest.mocked(authService);

describe('User Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/users', () => {
    it('debe retornar 201 al crear un usuario', async () => {
      mockUserService.create.mockResolvedValue({ id: 1, name: 'John' } as any);
      const res = await request(app).post('/api/users').send({ name: 'John', email: 'john@test.com' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 1);
    });

    it('debe retornar 409 si el correo ya existe', async () => {
      const error = new errorhandler(409, 'El correo ya está registrado');
      mockUserService.create.mockRejectedValue(error);
      const res = await request(app).post('/api/users').send({ email: 'dup@test.com' });
      expect(res.status).toBe(409);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockUserService.create.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/api/users').send({});
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/users/register', () => {
    it('debe retornar 201 al registrar un usuario', async () => {
      mockUserService.create.mockResolvedValue({ id: 2, name: 'Jane' } as any);
      const res = await request(app).post('/api/users/register').send({ name: 'Jane' });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/users', () => {
    it('debe retornar 200 con la lista de usuarios', async () => {
      mockUserService.findAll.mockResolvedValue([{ id: 1, name: 'John' }] as any);
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: 'John' }]);
    });

    it('debe retornar 500 si el service lanza error', async () => {
      mockUserService.findAll.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/users/getUsers', () => {
    it('debe retornar 200 con la lista de usuarios', async () => {
      mockUserService.findAll.mockResolvedValue([{ id: 1, name: 'John' }] as any);
      const res = await request(app).get('/api/users/getUsers');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/users/auth', () => {
    it('debe retornar 200 con el usuario autenticado', async () => {
      mockUserService.findCredential.mockResolvedValue({ id: 1, email: 'john@test.com' } as any);
      const res = await request(app).post('/api/users/auth').send({ email: 'john@test.com', password: '123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
    });

    it('debe retornar 401 con credenciales inválidas', async () => {
      const error = new errorhandler(401, 'Credenciales inválidas');
      mockUserService.findCredential.mockRejectedValue(error);
      const res = await request(app).post('/api/users/auth').send({ email: 'bad@test.com', password: 'wrong' });
      expect(res.status).toBe(401);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockUserService.findCredential.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/users/auth').send({ email: 'x', password: 'y' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/users/login', () => {
    it('debe retornar 201 con tokens y cookie', async () => {
      mockAuthService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: 1, name: 'John', role: 'admin', membership: 'premium' } as any,
      });
      const res = await request(app).post('/api/users/login').send({ email: 'john@test.com', password: 'Pass123!' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken', 'access-token');
      expect(res.body).toHaveProperty('refreshToken', 'refresh-token');
      expect(res.body).toHaveProperty('message', 'Login exitoso');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('debe retornar 400 si falta email', async () => {
      const res = await request(app).post('/api/users/login').send({ password: '123' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Correo y contraseña son requeridos' });
    });

    it('debe retornar 400 si falta password', async () => {
      const res = await request(app).post('/api/users/login').send({ email: 'x@test.com' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 401 si las credenciales son incorrectas', async () => {
      const error = new errorhandler(401, 'Credenciales incorrectas');
      mockAuthService.login.mockRejectedValue(error);
      const res = await request(app).post('/api/users/login').send({ email: 'bad@test.com', password: 'wrong' });
      expect(res.status).toBe(401);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/users/login').send({ email: 'x@test.com', password: 'y' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/users/refresh', () => {
    it('debe retornar 201 con nuevos tokens', async () => {
      mockAuthService.refresh.mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' });
      const res = await request(app).post('/api/users/refresh').send({ refreshToken: 'old-refresh' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken', 'new-access');
      expect(res.body).toHaveProperty('refreshToken', 'new-refresh');
    });

    it('debe retornar 401 si no se proporciona refreshToken', async () => {
      const res = await request(app).post('/api/users/refresh').send({});
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Usuario sin token' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.refresh.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/users/refresh').send({ refreshToken: 'invalid' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/users/logout', () => {
    it('debe retornar 200 al cerrar sesión', async () => {
      mockAuthService.logout.mockResolvedValue(undefined as any);
      const res = await request(app).post('/api/users/logout');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Sesión cerrada correctamente');
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockAuthService.logout.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/users/logout');
      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debe retornar 200 al actualizar el usuario', async () => {
      mockUserService.updateUser.mockResolvedValue({ id: 1, name: 'Updated' } as any);
      const res = await request(app).put('/api/users/1').send({ name: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Usuario actualizado correctamente');
      expect(res.body).toHaveProperty('updatedUser');
    });

    it('debe retornar 500 si el service lanza error', async () => {
      mockUserService.updateUser.mockRejectedValue(new Error('DB error'));
      const res = await request(app).put('/api/users/1').send({ name: 'X' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/users/legacy-login', () => {
    it('debe retornar 200 con el usuario autenticado', async () => {
      mockUserService.findCredential.mockResolvedValue({ id: 1, email: 'john@test.com' } as any);
      const res = await request(app).post('/api/users/legacy-login').send({ email: 'john@test.com', password: '123' });
      expect(res.status).toBe(200);
    });

    it('debe retornar 401 con credenciales inválidas', async () => {
      const error = new errorhandler(401, 'Credenciales inválidas');
      mockUserService.findCredential.mockRejectedValue(error);
      const res = await request(app).post('/api/users/legacy-login').send({ email: 'bad', password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });
});
