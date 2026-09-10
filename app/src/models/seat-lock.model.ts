import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface SeatLockAttributes {
  id: number;
  userId: number;
  showtimeId: number;
  seatId: number;
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  expiresAt: Date;
  releasedAt: Date | null;
}

export interface SeatLockCreationAttributes extends Optional<
  SeatLockAttributes,
  'id' | 'status' | 'releasedAt'
> {}

class SeatLock
  extends Model<SeatLockAttributes, SeatLockCreationAttributes>
  implements SeatLockAttributes
{
  public id!: number;
  public userId!: number;
  public showtimeId!: number;
  public seatId!: number;
  public status!: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  public expiresAt!: Date;
  public releasedAt!: Date | null;
}

SeatLock.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    showtimeId: { type: DataTypes.INTEGER, allowNull: false, field: 'showtime_id' },
    seatId: { type: DataTypes.INTEGER, allowNull: false, field: 'seat_id' },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'RELEASED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    releasedAt: { type: DataTypes.DATE, allowNull: true, field: 'released_at' },
  },
  {
    sequelize,
    modelName: 'SeatLock',
    tableName: 'seat_locks',
    timestamps: true,
    indexes: [
      { fields: ['user_id', 'status'] },
      { fields: ['seat_id', 'status'] },
      { fields: ['expires_at'] },
    ],
  },
);

export default SeatLock;
