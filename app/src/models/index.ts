// app/src/models/index.ts

/**
 * Índice de Modelos y Asociaciones
 * --------------------------------
 * Este archivo centraliza la importación de todos los modelos de Sequelize
 * y define todas las relaciones (asociaciones) entre ellos.
 * 
 * NO deben definirse asociaciones en los archivos individuales de modelo.
 * Todas las asociaciones se definen aquí de forma centralizada.
 * 
 * Jerarquía de relaciones:
 * 
 *   1:N  Country → Department
 *   1:N  Department → City
 *   1:N  City → Cinema
 *   N:M  Cinema ←→ Movie (a través de Showtime)
 *   1:1  User → Profile
 *   1:1  User → Membership
 *   1:N  User → PurchaseHistory
 *   1:N  Membership → PurchaseHistory
 */

import Country from "./country.model";
import Department from "./department.model";
import City from "./cities.model";
import Cinema from "./cinema.model";
import Movie from "./movie.model";
import Showtime from "./showtime.model";
import User from "./user.model";
import Profile from "./profile.model";
import Membership from "./membership.model";
import PurchaseHistory from "./purchase-history.model";

/**
 * Relación 1:N: Country → Department
 * Un país tiene muchos departamentos.
 * Un departamento pertenece a un país.
 */
// @ts-ignore
Country.hasMany(Department, {
  as: "departments",
  foreignKey: "countryId",
});

// @ts-ignore
Department.belongsTo(Country, {
  as: "country",
  foreignKey: "countryId",
});

/**
 * Relación 1:N: Department → City
 * Un departamento tiene muchas ciudades.
 * Una ciudad pertenece a un departamento.
 */
// @ts-ignore
Department.hasMany(City, {
  as: "cities",
  foreignKey: "departmentId",
});

// @ts-ignore
City.belongsTo(Department, {
  as: "department",
  foreignKey: "departmentId",
});

/**
 * Relación 1:N: City → Cinema
 * Una ciudad tiene muchos cines.
 * Un cine pertenece a una ciudad.
 */
// @ts-ignore
City.hasMany(Cinema, {
  as: "cinemas",
  foreignKey: "cityId",
});

// @ts-ignore
Cinema.belongsTo(City, {
  as: "city",
  foreignKey: "cityId",
});

/**
 * Relación N:M: Cinema ←→ Movie (a través de Showtime)
 * Un cine puede proyectar muchas películas.
 * Una película puede estar en muchos cines.
 * Showtime es la tabla intermedia que registra cada proyección.
 */
// @ts-ignore
Cinema.belongsToMany(Movie, {
  through: Showtime,
  as: "movies",
  foreignKey: "cinemaId",
});

// @ts-ignore
Movie.belongsToMany(Cinema, {
  through: Showtime,
  as: "cinemas",
  foreignKey: "movieId",
});

/**
 * Relación 1:1: User → Profile
 * Un usuario tiene un perfil.
 * Un perfil pertenece a un usuario.
 */
// @ts-ignore
User.hasOne(Profile, {
  as: "profile",
  foreignKey: "userId",
});

// @ts-ignore
Profile.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

/**
 * Relación 1:1: User → Membership
 * Un usuario tiene una membresía.
 * Una membresía pertenece a un usuario.
 */
// @ts-ignore
User.hasOne(Membership, {
  as: "userMembership",
  foreignKey: "userId",
});

// @ts-ignore
Membership.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

/**
 * Relación 1:N: User → PurchaseHistory
 * Un usuario tiene muchos historiales de compra.
 * Un historial de compra pertenece a un usuario.
 */
// @ts-ignore
User.hasMany(PurchaseHistory, {
  as: "purchaseHistories",
  foreignKey: "userId",
});

// @ts-ignore
PurchaseHistory.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

/**
 * Relación 1:N: Membership → PurchaseHistory
 * Una membresía tiene muchos historiales de compra.
 * Un historial de compra pertenece a una membresía.
 */
// @ts-ignore
Membership.hasMany(PurchaseHistory, {
  as: "purchases",
  foreignKey: "membershipId",
});

// @ts-ignore
PurchaseHistory.belongsTo(Membership, {
  as: "membership",
  foreignKey: "membershipId",
});

/**
 * Exportar todos los modelos para su uso en servicios, controladores y rutas.
 */
export { Country, Department, City, Cinema, Movie, Showtime, User, Profile, Membership, PurchaseHistory };
