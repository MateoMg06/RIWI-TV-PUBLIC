 // app/src/models/genreMovie.model.ts


  /**
   * Modelo de genreMovie
   * -----------------
   * Este archivo define el modelo `genreMovie` de Sequelize, que representa la tabla `genreMovie` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`GenreMovieAttributes`).
   *  - Atributos requeridos para la creación (`GenreMovieCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

   export interface GenreMovieAttributes {
    id: number;
    name: string;
    
  }

  export interface GenreMovieCreationAttributes extends Optional<GenreMovieAttributes, "id"> {}

  class GenreMovie extends Model<GenreMovieAttributes, GenreMovieCreationAttributes> implements GenreMovieAttributes {
    public id!: number;
    public name!: string;
  
  }

  GenreMovie.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "GenreMovie",
      tableName: "genre_movies",
      timestamps: true,
    }
  );

  export default GenreMovie;