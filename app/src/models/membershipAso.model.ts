  // app/src/models/membershipAso.model.ts

  /**
   * Modelo de membresia
   * -----------------
   * Este archivo define el modelo `membershipAso` de Sequelize, que representa la tabla `membershipAso` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`membershipAsoAttributes`).
   *  - Atributos requeridos para la creación (`membershipAsoCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   * 
   * Relaciones:
   *  - Pertenece a un usuario (un usuario tiene una mebresia)
   *  - Pertenece a un cine (un cine tiene muchas membresias)
   *  
   * 
   */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
   
import Membership from "./membership.model";
import Qr from "./qr.model";

Membership.hasOne(Qr, {
  foreignKey: "membershipId",
  as: "qr",
});

Qr.belongsTo(Membership, {
  foreignKey: "membershipId",
  as: "membership",
});
