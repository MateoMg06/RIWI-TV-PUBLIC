import type { NextFunction, Request, Response } from 'express';
import { SeedController } from '../controllers/seed.controller';
import { requireSeedKey } from '../middlewares/requireSeedKey';
import { createSeedRouter } from '../routes/seed.routes';
import { parseSeedPayload, type SeedPayload, type SeedResult } from '../seeders/seed';

const payload: SeedPayload = {
  location: {
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Medellín',
    cinema: 'Multicine Riwi Centro',
  },
  movies: [
    {
      name: 'Película de prueba',
      classification: 'PG',
      duration: 100,
      genre: 'Drama',
      releaseDate: '2026-09-10T00:00:00.000Z',
    },
  ],
};

const result: SeedResult = {
  message: 'Seeder procesado',
  created: {
    countries: 1,
    departments: 1,
    cities: 1,
    cinemas: 1,
    movies: 3,
    showtimes: 2,
    seats: 48,
  },
};

describe('POST /api/v1/seed', () => {
  const previousSeedKey = process.env.SEED_API_KEY;

  afterEach(() => {
    if (previousSeedKey === undefined) delete process.env.SEED_API_KEY;
    else process.env.SEED_API_KEY = previousSeedKey;
    jest.restoreAllMocks();
  });

  it('registra un endpoint POST', () => {
    const router = createSeedRouter(new SeedController(jest.fn().mockResolvedValue(result)));
    const layer = (
      router as unknown as {
        stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }>;
      }
    ).stack.find((item) => item.route?.path === '/');

    expect(layer?.route?.methods.post).toBe(true);
  });

  it('ejecuta el seeder y devuelve su resumen', async () => {
    const runSeed = jest.fn().mockResolvedValue(result);
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const controller = new SeedController(runSeed);

    const req = {
      file: { buffer: Buffer.from(JSON.stringify(payload)) },
    } as unknown as Request;

    await controller.execute(req, { status } as unknown as Response);

    expect(runSeed).toHaveBeenCalledTimes(1);
    expect(runSeed).toHaveBeenCalledWith(payload);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(result);
  });

  it('rechaza solicitudes sin una clave válida', () => {
    process.env.SEED_API_KEY = 'clave-segura';
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const next = jest.fn() as NextFunction;
    const req = { header: jest.fn().mockReturnValue('incorrecta') } as unknown as Request;

    requireSeedKey(req, { status, json } as unknown as Response, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('permite solicitudes con la clave configurada', () => {
    process.env.SEED_API_KEY = 'clave-segura';
    const next = jest.fn() as NextFunction;
    const req = { header: jest.fn().mockReturnValue('clave-segura') } as unknown as Request;

    requireSeedKey(req, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('rechaza un archivo que no cumple el contrato', () => {
    expect(() => parseSeedPayload({ movies: [] })).toThrow(
      'El JSON debe contener los objetos "location" y "movies"',
    );
  });
});
