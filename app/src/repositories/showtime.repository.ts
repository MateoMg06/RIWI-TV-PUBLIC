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

  async findActiveByCinemaIds(cinemaIds: number[], startDate?: string, endDate?: string): Promise<Showtime[]> {
    if (!cinemaIds.length) return [];
    const now = new Date();
    const start = startDate || now.toISOString().slice(0, 10);
    const end = endDate || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return await Showtime.findAll({
      where: {
        cinemaId: { [Op.in]: cinemaIds },
        showtime_status: 'ACTIVE',
        fecha: {
          [Op.between]: [start, end],
        },
      },
    });
  }

  async findActiveByCityId(cityId: number, startDate?: string, endDate?: string): Promise<Showtime[]> {
    const now = new Date();
    const start = startDate || now.toISOString().slice(0, 10);
    const end = endDate || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return await Showtime.findAll({
      where: {
        showtime_status: 'ACTIVE',
        fecha: {
          [Op.between]: [start, end],
        },
      },
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
