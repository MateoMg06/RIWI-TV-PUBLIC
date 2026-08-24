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
   */

  import User from "./user.model";
  import TypeMembership from "./typeMembership.model";
  import Membership from "./membership.model";
  import Qr from "./qr.model";
 

  /**
   * Relación 1:N: TypeMembership → Membership
   * Un tipo de membresía tiene muchas membresías.
   * Una membresía pertenece a un tipo de membresía.
   */
  // @ts-ignore
  TypeMembership.hasMany(Membership, {
    as: "memberships",
    foreignKey: "typeMembershipId",
  });

  // @ts-ignore
  Membership.belongsTo(TypeMembership, {
    as: "typeMembership",
    foreignKey: "typeMembershipId",
  });

  /**
   * Relación 1:N: Department → City
   * Un departamento tiene muchas ciudades.
   * Una ciudad pertenece a un departamento.
   */
  // @ts-ignore
  Membership.hasMany(User, {
    as: "users",
    foreignKey: "membershipId",
  });

 
Membership.hasOne(Qr, {
  foreignKey: "membershipId",
  as: "qr",
});

Qr.belongsTo(Membership, {
  foreignKey: "membershipId",
  as: "membership",
});


  /**
   * Exportar todos los modelos para su uso en servicios, controladores y rutas.
   */
  export { User, TypeMembership, Membership };
