import { Op } from 'sequelize';
import Showtime, { ShowtimeCreationAttributes } from '../models/showtime.model';
import Movie from '../models/movie.model';
import Cinema from '../models/cinema.model';

class ShowtimeRepository {
  findByPk(id: number): Promise<Showtime | null> {
    return Showtime.findByPk(id);
  }

  findAvailableById(id: number): Promise<Showtime | null> {
    return Showtime.findOne({
      where: { id, status: 'ACTIVE', startsAt: { [Op.gt]: new Date() } },
      include: [
        { model: Movie, as: 'movie', required: true, where: { status: 'ACTIVE' } },
        { model: Cinema, as: 'cinema', required: true, where: { active: true } },
      ],
    });
  }

  findByCinemaId(cinemaId: number): Promise<Showtime[]> {
    return Showtime.findAll({ where: { cinemaId }, order: [['startsAt', 'ASC']] });
  }

  findByMovieId(movieId: number): Promise<Showtime[]> {
    return Showtime.findAll({ where: { movieId }, order: [['startsAt', 'ASC']] });
  }

  findByCinemaAndMovie(cinemaId: number, movieId: number): Promise<Showtime | null> {
    return Showtime.findOne({ where: { cinemaId, movieId }, order: [['startsAt', 'ASC']] });
  }

  create(data: ShowtimeCreationAttributes): Promise<Showtime> {
    return Showtime.create(data);
  }

  destroy(id: number): Promise<number> {
    return Showtime.destroy({ where: { id } });
  }
}

export default new ShowtimeRepository();
