import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface GenreAttributes {
  id: number;
  name: string;
  active: boolean;
}

export interface GenreCreationAttributes extends Optional<GenreAttributes, "id" | "active"> {}

class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
  public id!: number;
  public name!: string;
  public active!: boolean;
}

Genre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Genre",
    tableName: "genres",
    timestamps: true,
  }
);

export default Genre;
