jest.mock('../models', () => ({}));
jest.mock('../services/city.service');
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
import cityService from '../services/city.service';

const mockCityService = jest.mocked(cityService);

describe('City Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/cities/:id/cinemas', () => {
    it('debe retornar 200 con los cines de la ciudad', async () => {
      mockCityService.findByPk.mockResolvedValue({ id: 1, city: 'Bogotá' } as any);
      mockCityService.getCinemas.mockResolvedValue([{ id: 1, name: 'Cinecol' }] as any);
      const res = await request(app).get('/api/cities/1/cinemas');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: 'Cinecol' }]);
    });

    it('debe retornar 400 si el ID no es válido', async () => {
      const res = await request(app).get('/api/cities/abc/cinemas');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El ID debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el ID es negativo', async () => {
      const res = await request(app).get('/api/cities/-5/cinemas');
      expect(res.status).toBe(400);
    });

    it('debe retornar 404 si la ciudad no existe', async () => {
      mockCityService.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/cities/999/cinemas');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Ciudad no encontrada' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCityService.findByPk.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/cities/1/cinemas');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/departments/:departmentId/cities', () => {
    it('debe retornar 201 al crear una ciudad', async () => {
      mockCityService.create.mockResolvedValue({ id: 1, city: 'Medellín' } as any);
      const res = await request(app).post('/api/departments/1/cities').send({ city: 'Medellín' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('city', 'Medellín');
    });

    it('debe retornar 400 si el departmentId no es válido', async () => {
      const res = await request(app).post('/api/departments/abc/cities').send({ city: 'Medellín' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si falta el campo city', async () => {
      const res = await request(app).post('/api/departments/1/cities').send({});
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si city está vacío', async () => {
      const res = await request(app).post('/api/departments/1/cities').send({ city: '' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si city no es string', async () => {
      const res = await request(app).post('/api/departments/1/cities').send({ city: 123 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCityService.create.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/departments/1/cities').send({ city: 'X' });
      expect(res.status).toBe(500);
    });
  });
});
