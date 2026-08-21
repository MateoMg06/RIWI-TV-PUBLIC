import Showtime from '../models/showtime.model';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import showtimeRepository from '../repositories/showtime.repository';
import { IShowtimeService } from './interfaces/showtime.service.interface';
import errorhandler from '../error/errorHandler';

class ShowtimeService implements IShowtimeService {
  async create(dto: CreateShowtimeDto): Promise<any> {
    // Validar duplicado
    const duplicate = await this.checkDuplicate(dto.cinemaId, dto.movieId);
    if (duplicate) {
      throw new errorhandler(409, `Ya existe una proyección de esta película en este cine`);
    }

    return await showtimeRepository.create({
      cinemaId: dto.cinemaId,
      movieId: dto.movieId,
      horario: dto.horario,
      fecha: dto.fecha,
      sala: dto.sala,
      precio: dto.precio,
    });
  }

  async delete(id: number): Promise<void> {
    const showtime = await showtimeRepository.findByPk(id);
    if (!showtime) {
      throw new errorhandler(404, `Proyección con ID ${id} no encontrada`);
    }

    await showtimeRepository.destroy(id);
  }

  async findByCinemaId(cinemaId: number): Promise<any[]> {
    return await showtimeRepository.findByCinemaId(cinemaId);
  }

  async findByMovieId(movieId: number): Promise<any[]> {
    return await showtimeRepository.findByMovieId(movieId);
  }

  async checkDuplicate(cinemaId: number, movieId: number): Promise<boolean> {
    const existing = await showtimeRepository.findByCinemaAndMovie(cinemaId, movieId);
    return !!existing;
  }
}

export default new ShowtimeService();
