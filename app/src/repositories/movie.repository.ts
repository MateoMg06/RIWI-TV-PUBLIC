import { Op, WhereOptions } from 'sequelize';
import Movie, { MovieCreationAttributes } from '../models/movie.model';
import Showtime from '../models/showtime.model';
import Cinema from '../models/cinema.model';

export interface MovieFilters {
  cityId?: number;
  cinemaId?: number;
  genre?: string;
  classification?: string;
  language?: string;
  roomType?: string;
  format?: string;
  available?: boolean;
  from: Date;
  to: Date;
}

class MovieRepository {
  create(data: MovieCreationAttributes): Promise<Movie> {
    return Movie.create(data);
  }

  findAll(): Promise<Movie[]> {
    return Movie.findAll({ order: [['name', 'ASC']] });
  }

  findOne(name: string): Promise<Movie | null> {
    return Movie.findOne({ where: { name } });
  }

  findByPk(id: number): Promise<Movie | null> {
    return Movie.findByPk(id);
  }

  findCatalog(filters: MovieFilters): Promise<Movie[]> {
    const movieWhere: WhereOptions = { status: 'ACTIVE' };
    if (filters.genre) movieWhere.genre = filters.genre;
    if (filters.classification) movieWhere.classification = filters.classification;

    const showtimeWhere: WhereOptions = {
      startsAt: { [Op.between]: [filters.from, filters.to] },
      status: 'ACTIVE',
    };
    if (filters.cinemaId) showtimeWhere.cinemaId = filters.cinemaId;
    if (filters.language) showtimeWhere.language = filters.language;
    if (filters.roomType) showtimeWhere.roomType = filters.roomType;
    if (filters.format) showtimeWhere.format = filters.format;
    if (filters.available) showtimeWhere.availableSeats = { [Op.gt]: 0 };

    const cinemaWhere: WhereOptions = { active: true };
    if (filters.cityId) cinemaWhere.cityId = filters.cityId;

    return Movie.findAll({
      where: movieWhere,
      include: [
        {
          model: Showtime,
          as: 'showtimes',
          required: true,
          where: showtimeWhere,
          include: [{ model: Cinema, as: 'cinema', required: true, where: cinemaWhere }],
        },
      ],
      order: [
        [{ model: Showtime, as: 'showtimes' }, 'startsAt', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }

  findDetail(id: number, cityId?: number): Promise<Movie | null> {
    const cinemaWhere: WhereOptions = { active: true };
    if (cityId) cinemaWhere.cityId = cityId;
    return Movie.findByPk(id, {
      include: [
        {
          model: Showtime,
          as: 'showtimes',
          required: false,
          where: { startsAt: { [Op.gt]: new Date() }, status: 'ACTIVE' },
          include: [{ model: Cinema, as: 'cinema', required: true, where: cinemaWhere }],
        },
      ],
      order: [[{ model: Showtime, as: 'showtimes' }, 'startsAt', 'ASC']],
    });
  }

  findUpcoming(): Promise<Movie[]> {
    return Movie.findAll({
      where: { status: 'UPCOMING', releaseDate: { [Op.gt]: new Date() } },
      order: [['releaseDate', 'ASC']],
    });
  }

  findUpcomingById(id: number): Promise<Movie | null> {
    return Movie.findOne({
      where: { id, status: 'UPCOMING', releaseDate: { [Op.gt]: new Date() } },
    });
  }

  findRecommendations(movie: Movie): Promise<Movie[]> {
    return Movie.findAll({
      where: {
        id: { [Op.ne]: movie.id },
        genre: movie.genre,
        status: { [Op.in]: ['ACTIVE', 'UPCOMING'] },
      },
      order: [['audienceRating', 'DESC']],
      limit: 6,
    });
  }
}

export default new MovieRepository();
