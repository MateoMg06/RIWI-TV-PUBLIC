import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type SeatType = 'STANDARD' | 'VIP' | 'ACCESSIBLE';
export type SeatStatus = 'AVAILABLE' | 'HELD' | 'SOLD' | 'DISABLED';

export interface SeatAttributes {
  id: number;
  showtimeId: number;
  code: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  priceModifier: number;
}

export interface SeatCreationAttributes extends Optional<
  SeatAttributes,
  'id' | 'type' | 'status' | 'priceModifier'
> {}

class Seat extends Model<SeatAttributes, SeatCreationAttributes> implements SeatAttributes {
  public id!: number;
  public showtimeId!: number;
  public code!: string;
  public row!: string;
  public number!: number;
  public type!: SeatType;
  public status!: SeatStatus;
  public priceModifier!: number;
}

Seat.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    showtimeId: { type: DataTypes.INTEGER, allowNull: false, field: 'showtime_id' },
    code: { type: DataTypes.STRING(10), allowNull: false },
    row: { type: DataTypes.STRING(5), allowNull: false },
    number: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM('STANDARD', 'VIP', 'ACCESSIBLE'),
      allowNull: false,
      defaultValue: 'STANDARD',
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'HELD', 'SOLD', 'DISABLED'),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    },
    priceModifier: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'price_modifier',
    },
  },
  {
    sequelize,
    modelName: 'Seat',
    tableName: 'seats',
    timestamps: true,
    indexes: [{ unique: true, fields: ['showtime_id', 'code'] }],
  },
);

export default Seat;
