import type { CreateShowtimeDto } from '../dto/create-showtime.dto';
import ErrorHandler from '../error/errorHandler';
import showtimeRepository from '../repositories/showtime.repository';

class ShowtimeService {
  async create(cinemaId: number, movieId: number, dto: CreateShowtimeDto) {
    const startsAt = new Date(dto.startsAt);
    if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date())
      throw new ErrorHandler(400, 'startsAt debe ser una fecha futura');
    if (!dto.room?.trim() || !dto.price || dto.price <= 0)
      throw new ErrorHandler(400, 'room y price son requeridos');
    return showtimeRepository.create({ ...dto, cinemaId, movieId, startsAt });
  }

  async getAvailable(id: number) {
    const showtime = await showtimeRepository.findAvailableById(id);
    if (!showtime) throw new ErrorHandler(404, 'Función no disponible o ya iniciada');
    return showtime;
  }

  async getPrices(id: number) {
    const showtime = await this.getAvailable(id);
    const basePrice = Number(showtime.price);
    return {
      showtimeId: showtime.id,
      currency: 'COP',
      basePrice,
      format: showtime.format,
      roomType: showtime.roomType,
      seatPrices: {
        STANDARD: basePrice,
        ACCESSIBLE: basePrice,
        VIP: basePrice,
      },
    };
  }

  async delete(id: number): Promise<void> {
    if (!(await showtimeRepository.findByPk(id)))
      throw new ErrorHandler(404, 'Función no encontrada');
    await showtimeRepository.destroy(id);
  }

  findByCinemaId(cinemaId: number) {
    return showtimeRepository.findByCinemaId(cinemaId);
  }
  findByMovieId(movieId: number) {
    return showtimeRepository.findByMovieId(movieId);
  }
}

export default new ShowtimeService();
