  // app/src/models/qr.model.ts

  /**
   * Modelo de qr
   * -----------------
   * Este archivo define el modelo `qr` de Sequelize, que representa la tabla `qr` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`qrAttributes`).
   *  - Atributos requeridos para la creación (`qrCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   * 
   * Relaciones:
   *  - Pertenece a una membresia(una membresia tiene un qr)
   *  
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

  export interface QrAttributes {
     id: number;
     membershipId: number;
     token: string;
     status: "active" | "revoked";
  }

  export interface QrCreationAttributes extends Optional<QrAttributes, "id"> {}

  class Qr extends Model<QrAttributes, QrCreationAttributes> implements QrAttributes {
    public id!: number;
    public membershipId!: number;
    public token!: string;
    public status!: "active" | "revoked";
  }

  Qr.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      membershipId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      token: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("active", "revoked"),
        allowNull: false,
        defaultValue: "revoked",
      },        
    },
    {
      sequelize,
      modelName: "Qr",
      tableName: "qrs",
      timestamps: true,
    }
  );

  export default Qr;
