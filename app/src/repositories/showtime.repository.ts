import { Op } from 'sequelize';
import Showtime, { ShowtimeCreationAttributes } from '../models/showtime.model';
import Cinema from '../models/cinema.model';
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

  async findActiveByCinemaIds(cinemaIds: number[]): Promise<Showtime[]> {
    if (!cinemaIds.length) return [];
    return await Showtime.findAll({
      where: {
        cinemaId: { [Op.in]: cinemaIds },
        showtime_status: 'ACTIVE',
      },
    });
  }

  async findActiveByCityId(cityId: number): Promise<Showtime[]> {
    return await Showtime.findAll({
      where: { showtime_status: 'ACTIVE' },
      include: [
        {
          model: Cinema,
          as: 'cinema',
          where: { cityId, active: true },
          required: true,
          attributes: [],
        },
      ],
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
