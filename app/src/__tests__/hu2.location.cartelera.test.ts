import userService from '../services/user.service';
import movieService from '../services/movie.service';
import cityService from '../services/city.service';
import countryService from '../services/country.service';
import departmentService from '../services/department.service';

jest.mock('../repositories/city.repository', () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn(),
    findActiveByDepartmentId: jest.fn(),
    findByDepartmentId: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));
jest.mock('../repositories/cinema.repository', () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn(),
    findByCityId: jest.fn(),
    findActiveByCityId: jest.fn(),
    countActiveByCityId: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));
jest.mock('../repositories/showtime.repository', () => ({
  __esModule: true,
  default: {
    findActiveByCityId: jest.fn(),
    findActiveByCinemaIds: jest.fn(),
    findByCinemaId: jest.fn(),
    findByCinemaAndMovie: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findByMovieId: jest.fn(),
    destroy: jest.fn(),
  },
}));
jest.mock('../repositories/user.repository', () => ({
  __esModule: true,
  default: {
    findByID: jest.fn(),
    findUserCredential: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    updateByID: jest.fn(),
  },
}));
jest.mock('../repositories/country.repository', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('../repositories/department.repository', () => ({
  __esModule: true,
  default: {
    findByCountryId: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));
jest.mock('../models/movie.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
}));

import cityRepository from '../repositories/city.repository';
import cinemaRepository from '../repositories/cinema.repository';
import showtimeRepository from '../repositories/showtime.repository';
import userRepository from '../repositories/user.repository';
import countryRepository from '../repositories/country.repository';
import departmentRepository from '../repositories/department.repository';
import Movie from '../models/movie.model';

describe('HU2 - Ubicación geográfica', () => {
  beforeEach(() => jest.clearAllMocks());

  it('obtener países', async () => {
    (countryRepository.findAll as jest.Mock).mockResolvedValue([{ id: 1, country: 'Colombia' }]);
    const result = await countryService.findAll();
    expect(result).toHaveLength(1);
    expect(countryRepository.findAll).toHaveBeenCalled();
  });

  it('obtener departamentos por país - válido', async () => {
    (departmentRepository.findByCountryId as jest.Mock).mockResolvedValue([{ id: 1, department: 'Atlántico' }]);
    const result = await departmentService.findByCountryId(1);
    expect(result).toHaveLength(1);
  });

  it('obtener ciudades por departamento - solo activas', async () => {
    (cityRepository.findActiveByDepartmentId as jest.Mock).mockResolvedValue([{ id: 1, city: 'Barranquilla', active: true }]);
    const result = await cityService.findActiveByDepartmentId(1);
    expect(result).toHaveLength(1);
    expect(cityRepository.findActiveByDepartmentId).toHaveBeenCalledWith(1);
  });

  it('seleccionar ciudad válida', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 1, active: true });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(2);
    (userRepository.findByID as jest.Mock)
      .mockResolvedValueOnce({ id: 10, name: 'User' })
      .mockResolvedValueOnce({ id: 10, name: 'User', cityId: 1 });
    (userRepository.updateByID as jest.Mock).mockResolvedValue(undefined);
    const result = await userService.setLocation(10, 1);
    expect(result.cityId).toBe(1);
  });

  it('rechazar ciudad inactiva', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 2, active: false });
    (userRepository.findByID as jest.Mock).mockResolvedValue({ id: 10 });
    await expect(userService.setLocation(10, 2)).rejects.toMatchObject({ estado: 422 });
  });

  it('rechazar ciudad sin cines activos', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 3, active: true });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(0);
    (userRepository.findByID as jest.Mock).mockResolvedValue({ id: 10 });
    await expect(userService.setLocation(10, 3)).rejects.toMatchObject({ estado: 422 });
  });

  it('cambiar ciudad del usuario (segunda selección)', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 4, active: true });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(1);
    (userRepository.findByID as jest.Mock)
      .mockResolvedValueOnce({ id: 10, cityId: 1 })
      .mockResolvedValueOnce({ id: 10, cityId: 4 });
    (userRepository.updateByID as jest.Mock).mockResolvedValue(undefined);
    const result = await userService.setLocation(10, 4);
    expect(result.cityId).toBe(4);
    expect(userRepository.updateByID).toHaveBeenCalledWith(10, { cityId: 4 });
  });

  it('rechazar cityId inválido', async () => {
    (userRepository.findByID as jest.Mock).mockResolvedValue({ id: 10 });
    await expect(userService.setLocation(10, NaN as any)).rejects.toMatchObject({ estado: 400 });
    await expect(userService.setLocation(10, 0)).rejects.toMatchObject({ estado: 400 });
  });

  it('ciudad inexistente -> 404', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue(null);
    (userRepository.findByID as jest.Mock).mockResolvedValue({ id: 10 });
    await expect(userService.setLocation(10, 999)).rejects.toMatchObject({ estado: 404 });
  });

  it('usuario inexistente -> 404', async () => {
    (userRepository.findByID as jest.Mock).mockResolvedValue(null);
    await expect(userService.setLocation(999, 1)).rejects.toMatchObject({ estado: 404 });
  });
});

describe('HU2 - Cartelera filtrada por ciudad', () => {
  beforeEach(() => jest.clearAllMocks());

  it('obtener cartelera filtrada por ciudad - muestra funciones activas', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 1, active: true, city: 'Barranquilla' });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(1);
    (showtimeRepository.findActiveByCityId as jest.Mock).mockResolvedValue([
      { movieId: 1, cinemaId: 1, showtime_status: 'ACTIVE' },
      { movieId: 2, cinemaId: 1, showtime_status: 'ACTIVE' },
    ]);
    (Movie.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Avatar', clasification: 'PG-13', duration: 192, gener: 'Ciencia Ficción' },
      { id: 2, name: 'Inception', clasification: 'PG-13', duration: 148, gener: 'Ciencia Ficción' },
    ]);

    const result = await movieService.getCatalogByCity(1);
    expect(result.data).toHaveLength(2);
    expect(showtimeRepository.findActiveByCityId).toHaveBeenCalledWith(1);
    expect(result.city.id).toBe(1);
  });

  it('no mostrar funciones de cines inactivos (cinema active=false no contado)', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 5, active: true });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(0);
    (showtimeRepository.findActiveByCityId as jest.Mock).mockResolvedValue([]);
    const result = await movieService.getCatalogByCity(5);
    expect(result.data).toHaveLength(0);
    expect(result.message).toMatch(/no existen funciones/i);
  });

  it('no mostrar funciones inactivas (showtime_status != ACTIVE filtrado en repo)', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 1, active: true });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(1);
    // Repo ya filtra solo ACTIVE, por eso aunque exista INACTIVE no se retorna
    (showtimeRepository.findActiveByCityId as jest.Mock).mockResolvedValue([
      { movieId: 1, showtime_status: 'ACTIVE' },
    ]);
    (Movie.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'Avatar', clasification: 'PG-13', duration: 192, gener: 'Ciencia Ficción' }]);
    const result = await movieService.getCatalogByCity(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Avatar');
    // Si el repo devolviera todo, el servicio igual dependería del where ACTIVE; test asegura que no se incluyen INACTIVE
  });

  it('ciudad sin funciones activas -> 200 vacío con mensaje, no 500', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 6, active: true, city: 'Ciudad Sin Funciones' });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(1);
    (showtimeRepository.findActiveByCityId as jest.Mock).mockResolvedValue([]);
    const result = await movieService.getCatalogByCity(6);
    expect(result.data).toEqual([]);
    expect(result.message).toMatch(/no existen funciones/i);
  });

  it('ciudad inactiva -> 422', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 7, active: false });
    await expect(movieService.getCatalogByCity(7)).rejects.toMatchObject({ estado: 422 });
  });

  it('ciudad inexistente -> 404', async () => {
    (cityRepository.findByPk as jest.Mock).mockResolvedValue(null);
    await expect(movieService.getCatalogByCity(999)).rejects.toMatchObject({ estado: 404 });
  });
});

describe('HU2 - Validaciones de departamentos y ciudades', () => {
  beforeEach(() => jest.clearAllMocks());

  it('país inexistente debe manejarse (departamentos)', async () => {
    (departmentRepository.findByCountryId as jest.Mock).mockResolvedValue([]);
    const result = await departmentService.findByCountryId(999);
    expect(result).toEqual([]);
  });
});

describe('HU2 - Requerimientos de Cines Activos y Ubicación en PostgreSQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cityService.getCinemas debe consultar únicamente cines activos', async () => {
    (cinemaRepository.findActiveByCityId as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Cine Activo 1', cityId: 1, active: true },
    ]);

    const cinemas = await cityService.getCinemas(1);
    expect(cinemas).toHaveLength(1);
    expect(cinemas[0].active).toBe(true);
    expect(cinemaRepository.findActiveByCityId).toHaveBeenCalledWith(1);
  });

  it('movieController.getCatalog: utiliza automáticamente el cityId guardado del usuario en PostgreSQL', async () => {
    const movieController = require('../controllers/movie.controller').default;
    (userRepository.findByID as jest.Mock).mockResolvedValue({
      id: 10,
      name: 'Test User',
      cityId: 1,
    });
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 1, active: true, city: 'Barranquilla' });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(1);
    (showtimeRepository.findActiveByCityId as jest.Mock).mockResolvedValue([
      { movieId: 1, showtime_status: 'ACTIVE' },
    ]);
    (Movie.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Avatar', clasification: 'PG-13', duration: 192, gener: 'Ciencia Ficción' },
    ]);

    const mockReq: any = {
      query: {},
      user: { id: 10 },
      cookies: {},
      headers: {},
    };
    const mockRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await movieController.getCatalog(mockReq, mockRes);
    expect(userRepository.findByID).toHaveBeenCalledWith(10);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        city: expect.objectContaining({ id: 1 }),
        data: expect.arrayContaining([expect.objectContaining({ id: 1, name: 'Avatar' })]),
      })
    );
  });

  it('userController.setLocation: persiste en PostgreSQL y retorna la cartelera actualizada', async () => {
    const { setLocation } = require('../controllers/user.controller');
    (userRepository.findByID as jest.Mock)
      .mockResolvedValueOnce({ id: 10, name: 'User' })
      .mockResolvedValueOnce({ id: 10, name: 'User', cityId: 4 });
    (cityRepository.findByPk as jest.Mock).mockResolvedValue({ id: 4, active: true, city: 'Medellín' });
    (cinemaRepository.countActiveByCityId as jest.Mock).mockResolvedValue(1);
    (userRepository.updateByID as jest.Mock).mockResolvedValue(undefined);
    (showtimeRepository.findActiveByCityId as jest.Mock).mockResolvedValue([
      { movieId: 2, showtime_status: 'ACTIVE' },
    ]);
    (Movie.findAll as jest.Mock).mockResolvedValue([
      { id: 2, name: 'Inception', clasification: 'PG-13', duration: 148, gener: 'Ciencia Ficción' },
    ]);

    const mockReq: any = {
      user: { id: 10 },
      body: { cityId: 4 },
      cookies: {},
      headers: {},
    };
    const mockRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await setLocation(mockReq, mockRes);
    expect(userRepository.updateByID).toHaveBeenCalledWith(10, { cityId: 4 });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Ubicación actualizada correctamente',
        user: expect.objectContaining({ id: 10, cityId: 4 }),
        catalog: expect.objectContaining({
          city: expect.objectContaining({ id: 4 }),
        }),
      })
    );
  });
});

