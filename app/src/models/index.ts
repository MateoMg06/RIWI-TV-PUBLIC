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
  import Genre from "./genre.model";
  import Classification from "./classification.model";
  import Language from "./language.model";
  import User from "./user.model";
  import ReleaseNotification from "./release-notification.model";

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

  Movie.belongsToMany(Genre, {
    through: "movie_genres",
    as: "genres",
    foreignKey: "movie_id",
    otherKey: "genre_id",
  });

  Genre.belongsToMany(Movie, {
    through: "movie_genres",
    as: "movies",
    foreignKey: "genre_id",
    otherKey: "movie_id",
  });

  Movie.belongsTo(Classification, {
    as: "classification",
    foreignKey: "classificationId",
  });

  Classification.hasMany(Movie, {
    as: "movies",
    foreignKey: "classificationId",
  });

  Movie.belongsTo(Language, {
    as: "language",
    foreignKey: "languageId",
  });

  Language.hasMany(Movie, {
    as: "movies",
    foreignKey: "languageId",
  });

  User.hasMany(ReleaseNotification, {
    as: "releaseNotifications",
    foreignKey: "userId",
  });

  ReleaseNotification.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
  });

  Movie.hasMany(ReleaseNotification, {
    as: "releaseNotifications",
    foreignKey: "movieId",
  });

  ReleaseNotification.belongsTo(Movie, {
    as: "movie",
    foreignKey: "movieId",
  });

  /**
   * Exportar todos los modelos para su uso en servicios, controladores y rutas.
   */
  export { Country, Department, City, Cinema, Movie, Showtime, Genre, Classification, Language, User, ReleaseNotification };
