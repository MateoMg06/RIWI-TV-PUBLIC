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

  export interface MovieAttributes {
    id: number;
    name: string;
    synopsis: string;
    classification: string;
    duration: number;
    genre: string;
    director: string;
    cast: string;
    poster_url: string;
    banner_url: string;
    trailer_url: string;
    release_date: Date;
    status: boolean;
    audience_rating: number;
  }

  export interface MovieCreationAttributes extends Optional<MovieAttributes, "id"> {}

  class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
    public id!: number;
    public name!: string;
    public synopsis!: string;
    public classification!: string;
    public duration!: number;
    public genre!: string;
    public director!: string;
    public cast!: string;
    public poster_url!: string;
    public banner_url!: string;
    public trailer_url!: string;
    public release_date!: Date;
    public status! : boolean;
    public audience_rating!: number;
    
    
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
      synopsis: {
        type: DataTypes.STRING(500),
        allowNull: false,
      }, 
      classification: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cast: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      poster_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      banner_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      trailer_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      release_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      audience_rating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Movie",
      tableName: "movies",
      timestamps: true,
    }
  );

  export default Movie;
