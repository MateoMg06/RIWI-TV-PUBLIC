jest.mock('../models', () => ({}));
jest.mock('../services/membership.service');
jest.mock('../models/membership.model');
jest.mock('../repositories/membership.repository');
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
import membershipService from '../services/membership.service';
import errorhandler from '../error/errorHandler';

const mockMembershipService = jest.mocked(membershipService);

describe('Membership Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/membership', () => {
    it('debe retornar 200 con la lista de membresías', async () => {
      mockMembershipService.getAll.mockResolvedValue([{ id: 1, membershipType: 'Premium' }] as any);
      const res = await request(app).get('/api/membership');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, membershipType: 'Premium' }]);
    });

    it('debe retornar 500 si el service lanza error', async () => {
      mockMembershipService.getAll.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/api/membership');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/membership/:name/user', () => {
    it('debe retornar 200 con la membresía del usuario', async () => {
      mockMembershipService.getByUserName.mockResolvedValue({ id: 1, userId: 1, membershipType: 'Premium' } as any);
      const res = await request(app).get('/api/membership/john/user');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('membershipType', 'Premium');
    });

    it('debe retornar 400 si el nombre está vacío', async () => {
      const res = await request(app).get('/api/membership/%20/user');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Nombre de usuario inválido' });
    });

    it('debe retornar 404 si la membresía no existe', async () => {
      mockMembershipService.getByUserName.mockRejectedValue(new Error('Membresía no encontrada para ese usuario'));
      const res = await request(app).get('/api/membership/nouser/user');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/membership', () => {
    it('debe retornar 201 al crear una membresía', async () => {
      mockMembershipService.create.mockResolvedValue({ id: 1, membershipType: 'Standard' } as any);
      const res = await request(app).post('/api/membership').send({ userId: 1, membershipType: 'Standard' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 1);
    });

    it('debe retornar 500 si el service lanza error', async () => {
      mockMembershipService.create.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/api/membership').send({ userId: 1 });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/membership/create', () => {
    it('debe retornar 201 al crear membresía para el usuario autenticado', async () => {
      mockMembershipService.createMembership.mockResolvedValue({
        message: 'Membresía creada exitosamente',
        membershipCode: 'MEM-ABC12345',
      });
      const res = await request(app).post('/api/membership/create').send({ durationMonths: 12, initialBonus: 100 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Membresía creada exitosamente');
      expect(res.body).toHaveProperty('membershipCode');
    });

    it('debe retornar 404 si el usuario no existe', async () => {
      const error = new errorhandler(404, 'Usuario no encontrado');
      mockMembershipService.createMembership.mockRejectedValue(error);
      const res = await request(app).post('/api/membership/create').send({ durationMonths: 12 });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuario no encontrado' });
    });

    it('debe retornar 400 si el usuario ya tiene membresía', async () => {
      const error = new errorhandler(400, 'El usuario ya tiene una membresía activa');
      mockMembershipService.createMembership.mockRejectedValue(error);
      const res = await request(app).post('/api/membership/create').send({ durationMonths: 12 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockMembershipService.createMembership.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/membership/create').send({ durationMonths: 12 });
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/membership/me', () => {
    it('debe retornar 200 con la membresía del usuario', async () => {
      mockMembershipService.getMembershipByUserId.mockResolvedValue({ id: 1, userId: 1, membershipType: 'Premium' } as any);
      const res = await request(app).get('/api/membership/me');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('membershipType', 'Premium');
    });

    it('debe retornar 404 si el usuario no tiene membresía', async () => {
      const error = new errorhandler(404, 'Membresía no encontrada');
      mockMembershipService.getMembershipByUserId.mockRejectedValue(error);
      const res = await request(app).get('/api/membership/me');
      expect(res.status).toBe(404);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockMembershipService.getMembershipByUserId.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/membership/me');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/membership/purchase-history', () => {
    it('debe retornar 200 con el historial de compras', async () => {
      mockMembershipService.getPurchaseHistory.mockResolvedValue([{ id: 1, amount: 50000 }] as any);
      const res = await request(app).get('/api/membership/purchase-history');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('debe retornar array vacío si no hay historial', async () => {
      mockMembershipService.getPurchaseHistory.mockResolvedValue([]);
      const res = await request(app).get('/api/membership/purchase-history');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('debe retornar 404 si el usuario no existe', async () => {
      const error = new errorhandler(404, 'Usuario no encontrado');
      mockMembershipService.getPurchaseHistory.mockRejectedValue(error);
      const res = await request(app).get('/api/membership/purchase-history');
      expect(res.status).toBe(404);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockMembershipService.getPurchaseHistory.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/membership/purchase-history');
      expect(res.status).toBe(500);
    });
  });
});
