 // app/src/models/country.model.ts


  /**
   * Modelo de pais
   * -----------------
   * Este archivo define el modelo `pais` de Sequelize, que representa la tabla `pais` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`PaiseAttributes`).
   *  - Atributos requeridos para la creación (`PaisCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

   export interface CityAttributes {
    id: number;
    city: string;
   
    
  }

  export interface CityCreationAttributes extends Optional<CityAttributes, "id"> {}

  class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
    public id!: number;
    public city!: string;
   
    
  }

  City.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "department",
      timestamps: true,
    }
  );

  export default City;