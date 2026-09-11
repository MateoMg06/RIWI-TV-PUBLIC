import type { MovieStatus } from '../models/movie.model';

export interface CreateMovieDto {
  name: string;
  synopsis?: string;
  classification: string;
  duration: number;
  genre: string;
  director?: string;
  cast?: string[];
  posterUrl?: string | null;
  bannerUrl?: string | null;
  trailerUrl?: string | null;
  releaseDate: string | Date;
  status?: MovieStatus;
  audienceRating?: number;
}
