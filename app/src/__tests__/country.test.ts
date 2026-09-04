jest.mock('../models', () => ({}));
jest.mock('../services/country.service');
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
import countryService from '../services/country.service';
import errorhandler from '../error/errorHandler';

const mockCountryService = jest.mocked(countryService);

describe('Country Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/countries', () => {
    it('debe retornar 200 con la lista de países', async () => {
      mockCountryService.findAll.mockResolvedValue([{ id: 1, country: 'Colombia' }] as any);
      const res = await request(app).get('/api/countries');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, country: 'Colombia' }]);
    });

    it('debe retornar 500 si el service lanza error', async () => {
      mockCountryService.findAll.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/api/countries');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/countries/:id/departments', () => {
    it('debe retornar 200 con los departamentos', async () => {
      mockCountryService.findByPk.mockResolvedValue({ id: 1 } as any);
      mockCountryService.getDepartments.mockResolvedValue([{ id: 1, department: 'Cundinamarca' }] as any);
      const res = await request(app).get('/api/countries/1/departments');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, department: 'Cundinamarca' }]);
    });

    it('debe retornar 400 si el ID no es válido', async () => {
      const res = await request(app).get('/api/countries/abc/departments');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El ID debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el ID es negativo', async () => {
      const res = await request(app).get('/api/countries/-1/departments');
      expect(res.status).toBe(400);
    });

    it('debe retornar 404 si el país no existe', async () => {
      mockCountryService.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/countries/999/departments');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'País no encontrado' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCountryService.findByPk.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/countries/1/departments');
      expect(res.status).toBe(500);
    });

    it('debe retornar el código de error del errorhandler', async () => {
      const error = new errorhandler(404, 'No encontrado');
      mockCountryService.findByPk.mockRejectedValue(error);
      const res = await request(app).get('/api/countries/1/departments');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/countries', () => {
    it('debe retornar 201 al crear un país', async () => {
      mockCountryService.create.mockResolvedValue({ id: 1, country: 'Nuevo País' } as any);
      const res = await request(app).post('/api/countries').send({ country: 'Nuevo País' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('country', 'Nuevo País');
    });

    it('debe retornar 400 si el campo country está vacío', async () => {
      const res = await request(app).post('/api/countries').send({ country: '' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si falta el campo country', async () => {
      const res = await request(app).post('/api/countries').send({});
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si country no es string', async () => {
      const res = await request(app).post('/api/countries').send({ country: 123 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCountryService.create.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/countries').send({ country: 'X' });
      expect(res.status).toBe(500);
    });

    it('debe retornar el código de error del errorhandler', async () => {
      const error = new errorhandler(409, 'País ya existe');
      mockCountryService.create.mockRejectedValue(error);
      const res = await request(app).post('/api/countries').send({ country: 'Dup' });
      expect(res.status).toBe(409);
    });
  });
});
