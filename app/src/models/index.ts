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

  import Country from "./country.model";
  import Department from "./department.model";
  import City from "./cities.model";
  import Cinema from "./cinema.model";
  import Movie from "./movie.model";
  import Showtime from "./showtime.model";
  import User from "./user.model";

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
   * Relación N:1 User -> City (ubicación seleccionada)
   */
  // @ts-ignore
  User.belongsTo(City, {
    as: "city",
    foreignKey: "cityId",
  });
  // @ts-ignore
  City.hasMany(User, {
    as: "users",
    foreignKey: "cityId",
  });

  /**
   * Relación 1:N Showtime -> Cinema / Movie (para includes filtrados por ciudad)
   */
  // @ts-ignore
  Showtime.belongsTo(Cinema, {
    as: "cinema",
    foreignKey: "cinemaId",
  });
  // @ts-ignore
  Showtime.belongsTo(Movie, {
    as: "movie",
    foreignKey: "movieId",
  });
  // @ts-ignore
  Cinema.hasMany(Showtime, {
    as: "showtimes",
    foreignKey: "cinemaId",
  });
  // @ts-ignore
  Movie.hasMany(Showtime, {
    as: "showtimes",
    foreignKey: "movieId",
  });

  /**
    * Exportar todos los modelos para su uso en servicios, controladores y rutas.
    */
  export { Country, Department, City, Cinema, Movie, Showtime, User };
