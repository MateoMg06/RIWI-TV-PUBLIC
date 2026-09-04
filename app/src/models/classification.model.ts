import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ClassificationAttributes {
  id: number;
  name: string;
  active: boolean;
}

export interface ClassificationCreationAttributes
  extends Optional<ClassificationAttributes, "id" | "active"> {}

class Classification
  extends Model<ClassificationAttributes, ClassificationCreationAttributes>
  implements ClassificationAttributes
{
  public id!: number;
  public name!: string;
  public active!: boolean;
}

Classification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
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
    modelName: "Classification",
    tableName: "classifications",
    timestamps: true,
  }
);

export default Classification;
