import Showtime, { ShowtimeCreationAttributes } from '../models/showtime.model';
import { IShowtimeRepository } from './interfaces/showtime.repository.interface';

class ShowtimeRepository implements IShowtimeRepository {
  async findByPk(id: number): Promise<Showtime | null> {
    return await Showtime.findByPk(id);
  }

  async findByCinemaId(cinemaId: number): Promise<Showtime[]> {
    return await Showtime.findAll({
      where: { cinemaId },
    });
  }

  async findByMovieId(movieId: number): Promise<Showtime[]> {
    return await Showtime.findAll({
      where: { movieId },
    });
  }

  async findByCinemaAndMovie(cinemaId: number, movieId: number): Promise<Showtime | null> {
    return await Showtime.findOne({
      where: { cinemaId, movieId },
    });
  }

  async create(data: ShowtimeCreationAttributes): Promise<Showtime> {
    return await Showtime.create(data);
  }

  async destroy(id: number): Promise<number> {
    return await Showtime.destroy({
      where: { id },
    });
  }
}

export default new ShowtimeRepository();
