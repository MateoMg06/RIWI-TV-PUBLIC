import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReleaseNotificationAttributes {
  id: number;
  userId: number;
  movieId: number;
  cityId: number | null;
  status: 'PENDING' | 'SENT';
}

type ReleaseNotificationCreationAttributes = Optional<
  ReleaseNotificationAttributes,
  'id' | 'cityId' | 'status'
>;

class ReleaseNotification
  extends Model<ReleaseNotificationAttributes, ReleaseNotificationCreationAttributes>
  implements ReleaseNotificationAttributes
{
  public id!: number;
  public userId!: number;
  public movieId!: number;
  public cityId!: number | null;
  public status!: 'PENDING' | 'SENT';
}

ReleaseNotification.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    movieId: { type: DataTypes.INTEGER, allowNull: false, field: 'movie_id' },
    cityId: { type: DataTypes.INTEGER, allowNull: true, field: 'city_id' },
    status: { type: DataTypes.ENUM('PENDING', 'SENT'), allowNull: false, defaultValue: 'PENDING' },
  },
  {
    sequelize,
    modelName: 'ReleaseNotification',
    tableName: 'release_notifications',
    timestamps: true,
    indexes: [{ unique: true, fields: ['user_id', 'movie_id'] }],
  },
);

export default ReleaseNotification;
