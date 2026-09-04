jest.mock('../models', () => ({}));
jest.mock('../services/cinema.service');
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
import cinemaService from '../services/cinema.service';
import errorhandler from '../error/errorHandler';

const mockCinemaService = jest.mocked(cinemaService);

describe('Cinema Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/cinemas', () => {
    it('debe retornar 201 al crear un cine', async () => {
      mockCinemaService.create.mockResolvedValue({ id: 1, name: 'Cinecol', cityId: 1 } as any);
      const res = await request(app).post('/api/cinemas').send({ name: 'Cinecol', cityId: 1 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Cinecol');
    });

    it('debe retornar 400 si falta el campo name', async () => {
      const res = await request(app).post('/api/cinemas').send({ cityId: 1 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si name está vacío', async () => {
      const res = await request(app).post('/api/cinemas').send({ name: '', cityId: 1 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si falta cityId', async () => {
      const res = await request(app).post('/api/cinemas').send({ name: 'Cine' });
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si cityId no es número positivo', async () => {
      const res = await request(app).post('/api/cinemas').send({ name: 'Cine', cityId: -1 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCinemaService.create.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/cinemas').send({ name: 'Cine', cityId: 1 });
      expect(res.status).toBe(500);
    });

    it('debe retornar el código de error del errorhandler', async () => {
      const error = new errorhandler(404, 'Ciudad no encontrada');
      mockCinemaService.create.mockRejectedValue(error);
      const res = await request(app).post('/api/cinemas').send({ name: 'Cine', cityId: 999 });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/cinemas/:id/movies', () => {
    it('debe retornar 200 con las películas del cine', async () => {
      mockCinemaService.findByPk.mockResolvedValue({ id: 1, name: 'Cinecol' } as any);
      mockCinemaService.getMovies.mockResolvedValue([{ id: 1, name: 'Spiderman' }] as any);
      const res = await request(app).get('/api/cinemas/1/movies');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: 'Spiderman' }]);
    });

    it('debe retornar 400 si el ID no es válido', async () => {
      const res = await request(app).get('/api/cinemas/abc/movies');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El ID debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el ID es negativo', async () => {
      const res = await request(app).get('/api/cinemas/-1/movies');
      expect(res.status).toBe(400);
    });

    it('debe retornar 404 si el cine no existe', async () => {
      mockCinemaService.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/cinemas/999/movies');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Cine no encontrado' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCinemaService.findByPk.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/cinemas/1/movies');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/cinemas/:id/movies/:movieId', () => {
    it('debe retornar 201 al agregar una película', async () => {
      mockCinemaService.addMovie.mockResolvedValue({ id: 1, cinemaId: 1, movieId: 1 } as any);
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ horario: '14:00', fecha: '2026-09-10', sala: 'Sala 1', precio: 15000 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('cinemaId', 1);
    });

    it('debe retornar 400 si el cinemaId no es válido', async () => {
      const res = await request(app).post('/api/cinemas/abc/movies/1').send({ horario: '14:00', fecha: '2026-09-10', sala: 'Sala 1', precio: 15000 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El cinemaId debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el movieId no es válido', async () => {
      const res = await request(app).post('/api/cinemas/1/movies/abc').send({ horario: '14:00', fecha: '2026-09-10', sala: 'Sala 1', precio: 15000 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El movieId debe ser un número entero positivo' });
    });

    it('debe retornar 400 si falta horario', async () => {
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ fecha: '2026-09-10', sala: 'Sala 1', precio: 15000 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El campo "horario" es requerido' });
    });

    it('debe retornar 400 si falta fecha', async () => {
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ horario: '14:00', sala: 'Sala 1', precio: 15000 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El campo "fecha" es requerido' });
    });

    it('debe retornar 400 si falta sala', async () => {
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ horario: '14:00', fecha: '2026-09-10', precio: 15000 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El campo "sala" es requerido' });
    });

    it('debe retornar 400 si falta precio', async () => {
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ horario: '14:00', fecha: '2026-09-10', sala: 'Sala 1' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El campo "precio" es requerido y debe ser un número positivo' });
    });

    it('debe retornar 400 si el precio es negativo', async () => {
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ horario: '14:00', fecha: '2026-09-10', sala: 'Sala 1', precio: -5 });
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCinemaService.addMovie.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).post('/api/cinemas/1/movies/1').send({ horario: '14:00', fecha: '2026-09-10', sala: 'Sala 1', precio: 15000 });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/cinemas/:id/movies/:movieId', () => {
    it('debe retornar 200 al eliminar la proyección', async () => {
      mockCinemaService.removeMovie.mockResolvedValue(undefined as any);
      const res = await request(app).delete('/api/cinemas/1/movies/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Proyección eliminada exitosamente' });
    });

    it('debe retornar 400 si el cinemaId no es válido', async () => {
      const res = await request(app).delete('/api/cinemas/abc/movies/1');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El cinemaId debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el movieId no es válido', async () => {
      const res = await request(app).delete('/api/cinemas/1/movies/abc');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El movieId debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el cinemaId es negativo', async () => {
      const res = await request(app).delete('/api/cinemas/-1/movies/1');
      expect(res.status).toBe(400);
    });

    it('debe retornar 400 si el movieId es negativo', async () => {
      const res = await request(app).delete('/api/cinemas/1/movies/-1');
      expect(res.status).toBe(400);
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCinemaService.removeMovie.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).delete('/api/cinemas/1/movies/1');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/cinemas/:id/showtimes', () => {
    it('debe retornar 200 con los horarios', async () => {
      mockCinemaService.findByPk.mockResolvedValue({ id: 1, name: 'Cinecol' } as any);
      mockCinemaService.getShowtimes.mockResolvedValue([{ id: 1, horario: '14:00' }] as any);
      const res = await request(app).get('/api/cinemas/1/showtimes');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, horario: '14:00' }]);
    });

    it('debe retornar 400 si el ID no es válido', async () => {
      const res = await request(app).get('/api/cinemas/abc/showtimes');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El ID debe ser un número entero positivo' });
    });

    it('debe retornar 400 si el ID es negativo', async () => {
      const res = await request(app).get('/api/cinemas/-1/showtimes');
      expect(res.status).toBe(400);
    });

    it('debe retornar 404 si el cine no existe', async () => {
      mockCinemaService.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/cinemas/999/showtimes');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Cine no encontrado' });
    });

    it('debe retornar 500 si el service lanza error genérico', async () => {
      mockCinemaService.findByPk.mockRejectedValue(new Error('Unexpected'));
      const res = await request(app).get('/api/cinemas/1/showtimes');
      expect(res.status).toBe(500);
    });
  });
});
