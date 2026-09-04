import { Request, Response } from 'express';
import cinemaService from '../services/cinema.service';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import errorhandler from '../error/errorHandler';

export const getCinemas = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const rawCityId = req.query.cityId as string | undefined;
    if (rawCityId !== undefined) {
      const cityId = parseInt(rawCityId, 10);
      if (isNaN(cityId) || cityId <= 0) {
        return res.status(400).json({ error: 'cityId debe ser un número entero positivo' });
      }
      const cinemas = await cinemaService.findActiveByCityId(cityId);
      return res.status(200).json(cinemas);
    }
    const cinemas = await cinemaService.findAll();
    return res.status(200).json(cinemas);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getCinemaMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const cinemaId = parseInt(id as string, 10);

    if (isNaN(cinemaId) || cinemaId <= 0) {
      return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }

    // Validar que el cine existe
    const cinema = await cinemaService.findByPk(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cine no encontrado' });
    }

    const movies = await cinemaService.getMovies(cinemaId);
    return res.status(200).json(movies);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const createCinema = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateCinemaDto = req.body;

    // Validar DTO
    if (!dto.name || typeof dto.name !== 'string' || dto.name.trim() === '') {
      return res.status(400).json({ error: 'El campo "name" es requerido y debe ser un string no vacío' });
    }

    if (!dto.cityId || typeof dto.cityId !== 'number' || dto.cityId <= 0) {
      return res.status(400).json({ error: 'El campo "cityId" es requerido y debe ser un número entero positivo' });
    }

    const cinema = await cinemaService.create(dto);
    return res.status(201).json(cinema);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const addMovieToCinema = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, movieId } = req.params;
    const cinemaId = parseInt(id as string, 10);
    const parsedMovieId = parseInt(movieId as string, 10);
    const dto: CreateShowtimeDto = req.body;

    // Validar IDs
    if (isNaN(cinemaId) || cinemaId <= 0) {
      return res.status(400).json({ error: 'El cinemaId debe ser un número entero positivo' });
    }

    if (isNaN(parsedMovieId) || parsedMovieId <= 0) {
      return res.status(400).json({ error: 'El movieId debe ser un número entero positivo' });
    }

    // Validar DTO
    if (!dto.horario || typeof dto.horario !== 'string' || dto.horario.trim() === '') {
      return res.status(400).json({ error: 'El campo "horario" es requerido' });
    }

    if (!dto.fecha) {
      return res.status(400).json({ error: 'El campo "fecha" es requerido' });
    }

    if (!dto.sala || typeof dto.sala !== 'string' || dto.sala.trim() === '') {
      return res.status(400).json({ error: 'El campo "sala" es requerido' });
    }

    if (!dto.precio || typeof dto.precio !== 'number' || dto.precio <= 0) {
      return res.status(400).json({ error: 'El campo "precio" es requerido y debe ser un número positivo' });
    }

    const showtime = await cinemaService.addMovie(cinemaId, parsedMovieId, { ...dto, cinemaId, movieId: parsedMovieId });
    return res.status(201).json(showtime);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const removeMovieFromCinema = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, movieId } = req.params;
    const cinemaId = parseInt(id as string, 10);
    const parsedMovieId = parseInt(movieId as string, 10);

    // Validar IDs
    if (isNaN(cinemaId) || cinemaId <= 0) {
      return res.status(400).json({ error: 'El cinemaId debe ser un número entero positivo' });
    }

    if (isNaN(parsedMovieId) || parsedMovieId <= 0) {
      return res.status(400).json({ error: 'El movieId debe ser un número entero positivo' });
    }

    await cinemaService.removeMovie(cinemaId, parsedMovieId);
    return res.status(200).json({ message: 'Proyección eliminada exitosamente' });
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getShowtimes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const cinemaId = parseInt(id as string, 10);

    if (isNaN(cinemaId) || cinemaId <= 0) {
      return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }

    // Validar que el cine existe
    const cinema = await cinemaService.findByPk(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cine no encontrado' });
    }

    const showtimes = await cinemaService.getShowtimes(cinemaId);
    return res.status(200).json(showtimes);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
