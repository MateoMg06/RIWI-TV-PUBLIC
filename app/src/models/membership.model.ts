  // app/src/models/membership.model.ts

  /**
   * Modelo de membresia
   * -----------------
   * Este archivo define el modelo `membresia` de Sequelize, que representa la tabla `membresia` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`MembershipAttributes`).
   *  - Atributos requeridos para la creación (`MembershipCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   * 
   * Relaciones:
   *  - Pertenece a un usuario (un usuario tiene una mebresia)
   *  
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

  export interface MembershipAttributes {
    id: number;
    userId: number;
    membershipType: string;
    
  }

  export interface MembershipCreationAttributes extends Optional<MembershipAttributes, "id"> {}

  class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
    public id!: number;
    public userId!: number;
    public membershipType!: string;
    
  }

  Membership.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      membershipType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },                
    },
    {
      sequelize,
      modelName: "Membership",
      tableName: "memberships",
      timestamps: true,
    }
  );

  export default Membership;
