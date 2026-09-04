 // app/src/models/country.model.ts


  /**
   * Modelo de country
   * -----------------
   * Este archivo define el modelo `Country` de Sequelize, que representa la tabla `Country` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`CountryAttributes`).
   *  - Atributos requeridos para la creación (`CountryCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

   export interface CountryAttributes {
    id: number;
    country: string;
   
    
  }

  export interface CountryCreationAttributes extends Optional<CountryAttributes, "id"> {}

  class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
    public id!: number;
    public country!: string;
   
    
  }

  Country.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Country",
      tableName: "country",
      timestamps: true,
    }
  );

  export default Country;