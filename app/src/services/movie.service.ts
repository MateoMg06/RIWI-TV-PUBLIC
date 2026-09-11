import { UniqueConstraintError } from 'sequelize';
import type { CreateMovieDto } from '../dto/create-movie.dto';
import type { GetMovieCatalogDto } from '../dto/get-movie-catalog.dto';
import ErrorHandler from '../error/errorHandler';
import Movie from '../models/movie.model';
import ReleaseNotification from '../models/release-notification.model';
import movieRepository, { MovieFilters } from '../repositories/movie.repository';

export interface CatalogFilters {
  cityId?: number;
  cinemaId?: number;
  genre?: string;
  classification?: string;
  language?: string;
  roomType?: string;
  format?: string;
  available?: boolean;
  date?: string;
}

const startOfDay = (date: Date): Date => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};
const endOfDay = (date: Date): Date => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

class MovieService {
  async create(dto: CreateMovieDto): Promise<GetMovieCatalogDto> {
    if (
      !dto.name?.trim() ||
      !dto.classification?.trim() ||
      !dto.genre?.trim() ||
      !dto.duration ||
      !dto.releaseDate
    ) {
      throw new ErrorHandler(
        400,
        'name, classification, genre, duration y releaseDate son requeridos',
      );
    }
    const movie = await movieRepository.create({
      ...dto,
      name: dto.name.trim(),
      classification: dto.classification.trim(),
      genre: dto.genre.trim(),
      releaseDate: new Date(dto.releaseDate),
    });
    return this.toDto(movie);
  }

  async getCatalog(
    filters: CatalogFilters = {},
    range: 'WEEK' | 'TODAY' = 'WEEK',
  ): Promise<GetMovieCatalogDto[]> {
    const base = filters.date ? new Date(`${filters.date}T00:00:00`) : new Date();
    if (Number.isNaN(base.getTime()))
      throw new ErrorHandler(400, 'date debe tener formato YYYY-MM-DD');
    const from = range === 'TODAY' || filters.date ? startOfDay(base) : new Date();
    const to =
      range === 'TODAY' || filters.date
        ? endOfDay(base)
        : endOfDay(new Date(base.getTime() + 6 * 86_400_000));
    const repositoryFilters: MovieFilters = { ...filters, from, to };
    const movies = await movieRepository.findCatalog(repositoryFilters);
    return movies.map((movie) => this.toDto(movie));
  }

  async getDetail(id: number, cityId?: number): Promise<GetMovieCatalogDto> {
    const movie = await movieRepository.findDetail(id, cityId);
    if (!movie) throw new ErrorHandler(404, 'Película no encontrada');
    return this.toDto(movie);
  }

  async getFunctions(id: number, cityId?: number): Promise<unknown[]> {
    const detail = await this.getDetail(id, cityId);
    return detail.showtimes ?? [];
  }

  async getRecommendations(id: number): Promise<GetMovieCatalogDto[]> {
    const movie = await movieRepository.findByPk(id);
    if (!movie) throw new ErrorHandler(404, 'Película no encontrada');
    return (await movieRepository.findRecommendations(movie)).map((item) => this.toDto(item));
  }

  async getUpcoming(): Promise<GetMovieCatalogDto[]> {
    return (await movieRepository.findUpcoming()).map((movie) => this.withCountdown(movie));
  }

  async getUpcomingDetail(id: number): Promise<GetMovieCatalogDto & { daysUntilRelease: number }> {
    const movie = await movieRepository.findUpcomingById(id);
    if (!movie) throw new ErrorHandler(404, 'Próximo estreno no encontrado');
    return this.withCountdown(movie);
  }

  async requestUpcomingNotification(
    userId: number,
    movieId: number,
    cityId?: number,
  ): Promise<ReleaseNotification> {
    const movie = await movieRepository.findUpcomingById(movieId);
    if (!movie) throw new ErrorHandler(404, 'Próximo estreno no encontrado');
    try {
      return await ReleaseNotification.create({ userId, movieId, cityId: cityId ?? null });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ErrorHandler(409, 'Ya existe una solicitud de notificación para esta película');
      }
      throw error;
    }
  }

  private toDto(movie: Movie): GetMovieCatalogDto {
    const plain = movie.get({ plain: true }) as Movie['dataValues'] & { showtimes?: unknown[] };
    return {
      id: plain.id,
      name: plain.name,
      synopsis: plain.synopsis,
      classification: plain.classification,
      duration: plain.duration,
      genre: plain.genre,
      director: plain.director,
      cast: plain.cast,
      posterUrl: plain.posterUrl,
      bannerUrl: plain.bannerUrl,
      trailerUrl: plain.trailerUrl,
      releaseDate: plain.releaseDate,
      status: plain.status,
      audienceRating: Number(plain.audienceRating),
      ...(plain.showtimes ? { showtimes: plain.showtimes } : {}),
    };
  }

  private withCountdown(movie: Movie): GetMovieCatalogDto & { daysUntilRelease: number } {
    const dto = this.toDto(movie);
    return {
      ...dto,
      daysUntilRelease: Math.max(
        0,
        Math.ceil((new Date(dto.releaseDate).getTime() - Date.now()) / 86_400_000),
      ),
    };
  }
}

export default new MovieService();
