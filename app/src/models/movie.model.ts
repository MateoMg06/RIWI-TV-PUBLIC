import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type MovieStatus = 'UPCOMING' | 'ACTIVE' | 'INACTIVE';

export interface MovieAttributes {
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
}

export interface MovieCreationAttributes extends Optional<
  MovieAttributes,
  | 'id'
  | 'synopsis'
  | 'director'
  | 'cast'
  | 'posterUrl'
  | 'bannerUrl'
  | 'trailerUrl'
  | 'status'
  | 'audienceRating'
> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public name!: string;
  public synopsis!: string;
  public classification!: string;
  public duration!: number;
  public genre!: string;
  public director!: string;
  public cast!: string[];
  public posterUrl!: string | null;
  public bannerUrl!: string | null;
  public trailerUrl!: string | null;
  public releaseDate!: Date;
  public status!: MovieStatus;
  public audienceRating!: number;
}

Movie.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    synopsis: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    classification: { type: DataTypes.STRING(50), allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    genre: { type: DataTypes.STRING(100), allowNull: false },
    director: { type: DataTypes.STRING(150), allowNull: false, defaultValue: '' },
    cast: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    posterUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'poster_url' },
    bannerUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'banner_url' },
    trailerUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'trailer_url' },
    releaseDate: { type: DataTypes.DATE, allowNull: false, field: 'release_date' },
    status: {
      type: DataTypes.ENUM('UPCOMING', 'ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    audienceRating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0,
      field: 'audience_rating',
    },
  },
  { sequelize, modelName: 'Movie', tableName: 'movies', timestamps: true },
);

export default Movie;
