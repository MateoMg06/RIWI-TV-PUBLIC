import Showtime from '../models/showtime.model';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import showtimeRepository from '../repositories/showtime.repository';
import { IShowtimeService } from './interfaces/showtime.service.interface';
import ErrorHandler from '../error/errorHandler';

class ShowtimeService implements IShowtimeService {
  async create(cinemaId: number, movieId: number, dto: CreateShowtimeDto): Promise<any> {
    // Validar duplicado
    const duplicate = await this.checkDuplicate(cinemaId, movieId);
    if (duplicate) {
      throw new ErrorHandler(409, `Ya existe una proyección de esta película en este cine`);
    }

    return await showtimeRepository.create({
      cinemaId,
      movieId,
      horario: dto.horario,
      fecha: dto.fecha,
      sala: dto.sala,
      precio: dto.precio,
    });
  }

  async delete(id: number): Promise<void> {
    const showtime = await showtimeRepository.findByPk(id);
    if (!showtime) {
      throw new ErrorHandler(404, `Proyección con ID ${id} no encontrada`);
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
