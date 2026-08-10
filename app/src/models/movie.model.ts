// app/src/models/user.model.ts

/**
 * Modelo de movie
 * -----------------
 * Este archivo define el modelo `Movie` de Sequelize, que representa la tabla `movies` en la base de datos.
 * 
 * Contiene:
 *  - Atributos del modelo (`MovieAttributes`).
 *  - Atributos requeridos para la creación (`MovieCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 * 
 * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Movie`.
 */
export interface movieAttributes {
  id: number;
  name: string;
  clasification: string;
  duration: number;
  gener: string;
}

/**
 * Atributos utilizados para la creación de un nuevo usuario.
 * 
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface movieCreationAttributes extends Optional<movieAttributes, "id"> {}

/**
 * Clase que representa el modelo `Movie` en Sequelize.
 * 
 * Implementa los atributos definidos en `MovieAttributes` y `MovieCreationAttributes`.
 */
class movie extends Model<movieAttributes, movieCreationAttributes> implements movieAttributes {
  /** Identificador único de la película (clave primaria). */
  public id!: number;

  /** Nombre completo de la película. */
  public name!: string;

  /** Clasificación de la película. */
  public clasification!: string;

  /** Duración de la película en minutos. */
  public duration!: number;

  /** Género de la película. */
  public gener!: string;
}

/**
 * Inicialización del modelo `Movie` con la configuración de Sequelize.
 * 
 * - `id`: Entero autoincremental, clave primaria.
 * - `name`: Nombre obligatorio con máximo 100 caracteres.
 * - `clasification`: Clasificación de la película con máximo 50 caracteres.
 * - `duration`: Duración de la película en minutos.
 * - `gener`: Género de la película con máximo 100 caracteres.
 */
movie.init(
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
    clasification: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gener: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "Movie",     // Nombre del modelo en Sequelize
    tableName: "movies",    // Nombre de la tabla en la base de datos
    timestamps: true,      // Incluye createdAt y updatedAt
  }
);

export default movie;
