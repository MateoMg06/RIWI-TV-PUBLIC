import Showtime, { ShowtimeCreationAttributes } from '../../models/showtime.model';

export interface IShowtimeRepository {
  findByPk(id: number): Promise<Showtime | null>;
  findByCinemaId(cinemaId: number): Promise<Showtime[]>;
  findByMovieId(movieId: number): Promise<Showtime[]>;
  findByCinemaAndMovie(cinemaId: number, movieId: number): Promise<Showtime | null>;
  create(data: ShowtimeCreationAttributes): Promise<Showtime>;
  destroy(id: number): Promise<number>;
}
