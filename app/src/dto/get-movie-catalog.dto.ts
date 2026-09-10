import type { MovieStatus } from '../models/movie.model';

export interface GetMovieCatalogDto {
  id: number;
  name: string;
  synopsis: string;
  classification: string;
  duration: number;
  genre: string;
  director: string;
  cast: string[];
  posterUrl: string | null;
  bannerUrl: string | null;
  trailerUrl: string | null;
  releaseDate: Date;
  status: MovieStatus;
  audienceRating: number;
  showtimes?: unknown[];
}
