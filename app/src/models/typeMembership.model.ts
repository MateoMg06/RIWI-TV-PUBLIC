  // app/src/models/typeMembership.model.ts

  /**
   * Modelo de typeMembership
   * -----------------
   * Este archivo define el modelo `typeMembership` de Sequelize, que representa la tabla `typeMembership` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`typeMembershipAttributes`).
   *  - Atributos requeridos para la creación (`typeMembershipCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   * 
   *  
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

  export interface typeMembershipAttributes {
    id: number;
    name: string;
    price: number;
    discount: number;
    
  }

  export interface typeMembershipCreationAttributes extends Optional<typeMembershipAttributes, "id"> {}

  class TypeMembership extends Model<typeMembershipAttributes, typeMembershipCreationAttributes> implements typeMembershipAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public discount!: number;
    
  }

  TypeMembership.init(
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
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "TypeMembership",
      tableName: "typeMembership",
      timestamps: true,
    }
  );

  export default TypeMembership;
