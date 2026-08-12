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
    gener: string;
    
  }

  export interface MovieCreationAttributes extends Optional<MovieAttributes, "id"> {}

  class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
    public id!: number;
    public name!: string;
    public clasification!: string;
    public duration!: number;
    public gener!: string;
    
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