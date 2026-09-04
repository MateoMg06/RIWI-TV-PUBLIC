jest.mock('../models', () => ({}));
jest.mock('../services/movie.service');
jest.mock('../models/movie.model');
jest.mock('../repositories/movie.repository');
jest.mock('../controllers/movie.controller', () => {
  const ctrl = {
    create: jest.fn(),
    getCatalog: jest.fn(),
    getByName: jest.fn(),
    getMovieCinemas: jest.fn(),
    getWeeklyMovies: jest.fn(),
    getTodayMovies: jest.fn(),
    getFilteredMovies: jest.fn(),
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
import * as movieController from '../controllers/movie.controller';

const ctrl = jest.mocked(movieController) as any;

const mockMovieDto = { id: 1, name: 'Spiderman', classification: 'PG-13', duration: 120, genre: 'Acción' };

describe('Movie Endpoints', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/movies', () => {
    it('debe retornar 200 con el catálogo', async () => {
      ctrl.getCatalog.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json([mockMovieDto]);
      });
      const res = await request(app).get('/api/movies');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockMovieDto]);
    });

    it('debe retornar 500 si el controller lanza error', async () => {
      ctrl.getCatalog.mockImplementation(async (_req: any, res: any) => {
        res.status(500).json({ error: 'DB error' });
      });
      const res = await request(app).get('/api/movies');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/movies/weekly', () => {
    it('debe retornar 200 con películas de la semana', async () => {
      ctrl.getWeeklyMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json([mockMovieDto]);
      });
      const res = await request(app).get('/api/movies/weekly');
      expect(res.status).toBe(200);
    });

    it('debe retornar 500 si el controller lanza error', async () => {
      ctrl.getWeeklyMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(500).json({ error: 'DB error' });
      });
      const res = await request(app).get('/api/movies/weekly');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/movies/today', () => {
    it('debe retornar 200 con películas de hoy', async () => {
      ctrl.getTodayMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json([{ ...mockMovieDto, id: 2, name: 'Today Movie' }]);
      });
      const res = await request(app).get('/api/movies/today');
      expect(res.status).toBe(200);
    });

    it('debe retornar 500 si el controller lanza error', async () => {
      ctrl.getTodayMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(500).json({ error: 'DB error' });
      });
      const res = await request(app).get('/api/movies/today');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/movies/filter', () => {
    it('debe retornar 200 con películas filtradas', async () => {
      ctrl.getFilteredMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json([mockMovieDto]);
      });
      const res = await request(app).get('/api/movies/filter?genre=Acción');
      expect(res.status).toBe(200);
    });

    it('debe retornar 500 si el controller lanza error', async () => {
      ctrl.getFilteredMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(500).json({ error: 'DB error' });
      });
      const res = await request(app).get('/api/movies/filter');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/movies/weeklyMovies', () => {
    it('debe retornar 200 con películas de la semana', async () => {
      ctrl.getWeeklyMovies.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json([mockMovieDto]);
      });
      const res = await request(app).get('/api/movies/weeklyMovies');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/movies/:id/cinemas', () => {
    it('debe retornar 200 con los cines', async () => {
      ctrl.getMovieCinemas.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json([{ id: 1, name: 'Cinecol' }]);
      });
      const res = await request(app).get('/api/movies/1/cinemas');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: 'Cinecol' }]);
    });

    it('debe retornar 400 si el ID no es válido', async () => {
      ctrl.getMovieCinemas.mockImplementation(async (_req: any, res: any) => {
        res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
      });
      const res = await request(app).get('/api/movies/abc/cinemas');
      expect(res.status).toBe(400);
    });

    it('debe retornar 404 si la película no existe', async () => {
      ctrl.getMovieCinemas.mockImplementation(async (_req: any, res: any) => {
        res.status(404).json({ error: 'Película no encontrada' });
      });
      const res = await request(app).get('/api/movies/999/cinemas');
      expect(res.status).toBe(404);
    });

    it('debe retornar 500 si ocurre un error', async () => {
      ctrl.getMovieCinemas.mockImplementation(async (_req: any, res: any) => {
        res.status(500).json({ error: 'Error' });
      });
      const res = await request(app).get('/api/movies/1/cinemas');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/movies/:name', () => {
    it('debe retornar 200 con la película', async () => {
      ctrl.getByName.mockImplementation(async (_req: any, res: any) => {
        res.status(200).json(mockMovieDto);
      });
      const res = await request(app).get('/api/movies/Spiderman');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMovieDto);
    });

    it('debe retornar 404 si la película no existe', async () => {
      ctrl.getByName.mockImplementation(async (_req: any, res: any) => {
        res.status(404).json({ message: 'Película no encontrada' });
      });
      const res = await request(app).get('/api/movies/NoExiste');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/movies', () => {
    it('debe retornar 201 al crear una película', async () => {
      ctrl.create.mockImplementation(async (_req: any, res: any) => {
        res.status(201).json(mockMovieDto);
      });
      const res = await request(app).post('/api/movies').send(mockMovieDto);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockMovieDto);
    });

    it('debe retornar 500 si el controller lanza error', async () => {
      ctrl.create.mockImplementation(async (_req: any, res: any) => {
        res.status(500).json({ error: 'DB error' });
      });
      const res = await request(app).post('/api/movies').send({ name: 'X' });
      expect(res.status).toBe(500);
    });
  });
});
