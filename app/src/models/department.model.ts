 // app/src/models/department.model.ts


  /**
   * Modelo de Department
   * -----------------
   * Este archivo define el modelo `Department` de Sequelize, que representa la tabla `Department` en la base de datos.
   * 
   * Contiene:
   *  - Atributos del modelo (`DepartmenteAttributes`).
   *  - Atributos requeridos para la creación (`DepartmentCreationAttributes`).
   *  - Definición del modelo con sus columnas y restricciones.
   * 
   * Este modelo es utilizado por los servicios y controladores para realizar operaciones CRUD.
   */

  import { DataTypes, Model, Optional } from "sequelize";
  import sequelize from "../config/database";

   export interface DepartmentAttributes {
    id: number;
    department: string;
    countryId: number;
  }

  export interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, "id"> {}

  class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
    public id!: number;
    public department!: string;
    public countryId!: number;
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "country_id",
      }
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "department",
      timestamps: true,
    }
  );

  export default Department;