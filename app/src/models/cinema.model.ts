  // app/src/models/cinema.model.ts

  /**
   * Modelo de cine
   * -----------------
   * Este archivo define el modelo `cinema` de Sequelize, que representa la tabla `cinema` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`CinemaAttributes`).
   *  - Atributos requeridos para la creación (`CinemaCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   * 
   * Relaciones:
   *  - Pertenece a una City (muchos cines en una ciudad)
   *  - Tiene muchas Movie (a través de Showtime)
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

  export interface CinemaAttributes {
    id: number;
    name: string;
    cityId: number;
    active: boolean;
  }

  export interface CinemaCreationAttributes extends Optional<CinemaAttributes, "id" | "active"> {}

  class Cinema extends Model<CinemaAttributes, CinemaCreationAttributes> implements CinemaAttributes {
    public id!: number;
    public name!: string;
    public cityId!: number;
    public active!: boolean;
  }

  Cinema.init(
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
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "city_id",
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    },
    {
      sequelize,
      modelName: "Cinema",
      tableName: "cinemas",
      timestamps: true,
    }
  );

  export default Cinema;
