import Movie from '../../models/movie.model';
import { CreateShowtimeDto } from '../../dto/create-showtime.dto';

export interface IShowtimeService {
  create(dto: CreateShowtimeDto): Promise<any>;
  delete(id: number): Promise<void>;
  findByCinemaId(cinemaId: number): Promise<any[]>;
  findByMovieId(movieId: number): Promise<any[]>;
  checkDuplicate(cinemaId: number, movieId: number): Promise<boolean>;
}
