import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface LanguageAttributes {
  id: number;
  name: string;
  active: boolean;
}

export interface LanguageCreationAttributes extends Optional<LanguageAttributes, "id" | "active"> {}

class Language extends Model<LanguageAttributes, LanguageCreationAttributes> implements LanguageAttributes {
  public id!: number;
  public name!: string;
  public active!: boolean;
}

Language.init(
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
    modelName: "Language",
    tableName: "languages",
    timestamps: true,
  }
);

export default Language;
