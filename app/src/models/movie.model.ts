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
    clasification: string;
    duration: number;
    poster: string;
    director: string;
    idioma: string;
    dobladaje: boolean;
    subtitulos: boolean;
    formatos: string;
    estado : boolean;
    fechaEstreno: Date;
    clasificacionPublica: string;

    
  }

  export interface MovieCreationAttributes extends Optional<MovieAttributes, "id"> {}

  class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
    public id!: number;
    public name!: string;
    public clasification!: string;
    public duration!: number;
    public poster!: string;
    public director!: string;
    public idioma!: string;
    public dobladaje!: boolean;
    public subtitulos!: boolean;
    public formatos!: string;
    public estado!: boolean;
    public fechaEstreno!: Date;
    public clasificacionPublica!: string;
    
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
      poster: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      director: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      idioma: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      dobladaje: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      subtitulos: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      formatos: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fechaEstreno: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      clasificacionPublica: {
        type: DataTypes.STRING(50),
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