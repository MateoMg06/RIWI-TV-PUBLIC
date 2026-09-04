import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type ReleaseNotificationStatus = "pendiente" | "enviada";

export interface ReleaseNotificationAttributes {
  id: number;
  userId: number;
  movieId: number;
  status: ReleaseNotificationStatus;
}

export interface ReleaseNotificationCreationAttributes
  extends Optional<ReleaseNotificationAttributes, "id" | "status"> {}

class ReleaseNotification
  extends Model<ReleaseNotificationAttributes, ReleaseNotificationCreationAttributes>
  implements ReleaseNotificationAttributes
{
  public id!: number;
  public userId!: number;
  public movieId!: number;
  public status!: ReleaseNotificationStatus;
}

ReleaseNotification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "movie_id",
    },
    status: {
      type: DataTypes.ENUM("pendiente", "enviada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    modelName: "ReleaseNotification",
    tableName: "release_notifications",
    timestamps: true,
  }
);

export default ReleaseNotification;
