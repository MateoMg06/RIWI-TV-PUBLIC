  // app/src/models/showtime.model.ts

  /**
   * Modelo de Showtime (Proyección)
   * ---------------------------------
   * Este archivo define el modelo `showtime` de Sequelize, que actúa como tabla intermedia
   * para la relación muchos-a-muchos (N:M) entre Cinema y Movie.
   * 
   * Cada Showtime representa una proyección de una película en un cine.
   * 
   * Contiene:
   *  - Atributos del modelo (`ShowtimeAttributes`).
   *  - Atributos requeridos para la creación (`ShowtimeCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Relaciones:
   *  - Pertenece a un Cinema
   *  - Pertenece a una Movie
   * 
   * Campos adicionales como horario, fecha, sala y precio pueden agregarse posteriormente
   * según los requisitos del negocio.
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

  export interface ShowtimeAttributes {
    id: number;
    cinemaId: number;
    movieId: number;
    horario: string; // Formato: HH:MM
    fecha: string | Date;
    sala: string;
    precio: number;
  }

  export interface ShowtimeCreationAttributes extends Optional<ShowtimeAttributes, "id"> {}

  class Showtime extends Model<ShowtimeAttributes, ShowtimeCreationAttributes> implements ShowtimeAttributes {
    public id!: number;
    public cinemaId!: number;
    public movieId!: number;
    public horario!: string;
    public fecha!: string | Date;
    public sala!: string;
    public precio!: number;
  }

  Showtime.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "cinema_id",
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "movie_id",
      },
      horario: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sala: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Showtime",
      tableName: "showtime",
      timestamps: true,
    }
  );

  export default Showtime;
