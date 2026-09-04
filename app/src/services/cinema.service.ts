import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import cinemaRepository from '../repositories/cinema.repository';
import cityRepository from '../repositories/city.repository';
import movieRepository from '../repositories/movie.repository';
import showtimeRepository from '../repositories/showtime.repository';
import { ICinemaService } from './interfaces/cinema.service.interface';
import ErrorHandler from '../error/errorHandler';

class CinemaService implements ICinemaService {
  async findByCityId(cityId: number): Promise<any[]> {
    return await cinemaRepository.findByCityId(cityId);
  }

  async findByPk(id: number): Promise<any | null> {
    return await cinemaRepository.findByPk(id);
  }

  async getMovies(cinemaId: number): Promise<any[]> {
    const cinema = await cinemaRepository.findWithMovies(cinemaId);
    return (cinema as any)?.['movies'] || [];
  }

  async create(dto: CreateCinemaDto): Promise<any> {
    // Validar que la ciudad exista
    const city = await cityRepository.findByPk(dto.cityId);
    if (!city) {
      throw new ErrorHandler(404, `Ciudad con ID ${dto.cityId} no encontrada`);
    }

    return await cinemaRepository.create(dto);
  }

  async addMovie(cinemaId: number, movieId: number, dto: CreateShowtimeDto): Promise<any> {
    // Validar que el cine exista
    const cinema = await cinemaRepository.findByPk(cinemaId);
    if (!cinema) {
      throw new ErrorHandler(404, `Cine con ID ${cinemaId} no encontrado`);
    }

    // Validar que la película exista
    const movie = await movieRepository.findByPk(movieId);
    if (!movie) {
      throw new ErrorHandler(404, `Película con ID ${movieId} no encontrada`);
    }

    // Validar que no exista ya una proyección de esta película en este cine
    const existingShowtime = await showtimeRepository.findByCinemaAndMovie(cinemaId, movieId);
    if (existingShowtime) {
      throw new ErrorHandler(409, `La película ${movieId} ya está asignada al cine ${cinemaId}`);
    }

    // Crear la proyección
    const showtime = await showtimeRepository.create({
      cinemaId,
      movieId,
      horario: dto.horario,
      fecha: dto.fecha,
      sala: dto.sala,
      precio: dto.precio,
    });

    return showtime;
  }

  async removeMovie(cinemaId: number, movieId: number): Promise<void> {
    const showtime = await showtimeRepository.findByCinemaAndMovie(cinemaId, movieId);
    if (!showtime) {
      throw new ErrorHandler(404, `Proyección no encontrada para el cine ${cinemaId} y película ${movieId}`);
    }

    await showtimeRepository.destroy(showtime.id);
  }

  async getShowtimes(cinemaId: number): Promise<any[]> {
    const showtimes = await showtimeRepository.findByCinemaId(cinemaId);
    return showtimes;
  }
}

export default new CinemaService();
