// app/src/models/movie.model.ts

/**
 * Modelo de pelicula
 * -----------------
 * Este archivo define el modelo `movie` de Sequelize, que representa la tabla `movie` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`MovieAttributes`).
 *  - Atributos requeridos para la creación (`MovieCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type MovieStatus = "proximo_estreno" | "en_cartelera" | "fuera_cartelera";

export interface MovieAttributes {
  id: number;
  name: string;
  clasification: string;
  duration: number;
  gener: string;
  synopsis: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  status: MovieStatus;
  classificationId: number | null;
  languageId: number | null;
}

export interface MovieCreationAttributes
  extends Optional<MovieAttributes, "id" | "synopsis" | "posterUrl" | "trailerUrl" | "status" | "classificationId" | "languageId"> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public name!: string;
  public clasification!: string;
  public duration!: number;
  public gener!: string;
  public synopsis!: string | null;
  public posterUrl!: string | null;
  public trailerUrl!: string | null;
  public status!: MovieStatus;
  public classificationId!: number | null;
  public languageId!: number | null;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    clasification: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gener: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    posterUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "poster_url",
    },
    trailerUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "trailer_url",
    },
    status: {
      type: DataTypes.ENUM("proximo_estreno", "en_cartelera", "fuera_cartelera"),
      allowNull: false,
      defaultValue: "en_cartelera",
    },
    classificationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "classification_id",
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "language_id",
    },
  },
  {
    sequelize,
    modelName: "Movie",
    tableName: "movies",
    timestamps: true,
  }
);

export default Movie;
