jest.mock('../models', () => ({}));
jest.mock('../services/department.service');
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
import departmentService from '../services/department.service';

const mockDepartmentService = jest.mocked(departmentService);

describe('Department Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/departments/:id/cities', () => {
    it('debe retornar 200 con las ciudades', async () => {
      mockDepartmentService.findByPk.mockResolvedValue({ id: 1, department: 'Cundinamarca' } as any);
      mockDepartmentService.getCities.mockResolvedValue([{ id: 1, city: 'Bogotá' }] as any);
      const res = await request(app).get('/api/departments/1/cities');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, city: 'Bogotá' }]);
    });

    it('debe retornar 400 si el ID no es válido', async () => {
      const res = await request(app).get('/api/departments/abc/cities');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El ID debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el ID es negativo', async () => {
      const res = await request(app).get('/api/departments/-1/cities');
      expect(res.status).toBe(400);
    });

    it('debe retornar 404 si el departamento no existe', async () => {
      mockDepartmentService.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/departments/999/cities');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Departamento no encontrado' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockDepartmentService.findByPk.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/departments/1/cities');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/countries/:countryId/departments', () => {
    it('debe retornar 201 al crear un departamento', async () => {
      mockDepartmentService.create.mockResolvedValue({ id: 1, department: 'Antioquia' } as any);
      const res = await request(app).post('/api/countries/1/departments').send({ department: 'Antioquia' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('department', 'Antioquia');
    });

    it('debe retornar 400 si el countryId no es válido', async () => {
      const res = await request(app).post('/api/countries/abc/departments').send({ department: 'X' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si falta el campo department', async () => {
      const res = await request(app).post('/api/countries/1/departments').send({});
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si department está vacío', async () => {
      const res = await request(app).post('/api/countries/1/departments').send({ department: '' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockDepartmentService.create.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/countries/1/departments').send({ department: 'X' });
      expect(res.status).toBe(500);
    });
  });
});
