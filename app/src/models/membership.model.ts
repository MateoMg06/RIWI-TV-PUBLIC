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
 *  - Pertenece a un usuario (un usuario tiene una membresía)
 *  
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface MembershipAttributes {
  id: number;
  userId: number;
  membershipType: string;
  code: string;
  status: "active" | "inactive" | "expired" | "pending";
  startDate: Date;
  endDate: Date;
  bonusWallet: number;
}

export interface MembershipCreationAttributes extends Optional<MembershipAttributes, "id"> {}

class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  public id!: number;
  public userId!: number;
  public membershipType!: string;
  public code!: string;
  public status!: "active" | "inactive" | "expired" | "pending";
  public startDate!: Date;
  public endDate!: Date;
  public bonusWallet!: number;
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
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    membershipType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "expired", "pending"),
      allowNull: false,
      defaultValue: 'pending',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bonusWallet: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
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
