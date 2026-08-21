import Cinema from '../../models/cinema.model';
import { CreateCinemaDto } from '../../dto/create-cinema.dto';

export interface ICinemaService {
  findByCityId(cityId: number): Promise<Cinema[]>;
  findByPk(id: number): Promise<Cinema | null>;
  getMovies(cinemaId: number): Promise<any[]>;
  create(dto: CreateCinemaDto): Promise<Cinema>;
  addMovie(cinemaId: number, movieId: number, dto: any): Promise<any>;
  removeMovie(cinemaId: number, movieId: number): Promise<void>;
}
