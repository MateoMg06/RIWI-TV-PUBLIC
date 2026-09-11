import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type ShowtimeStatus = 'ACTIVE' | 'SOLD_OUT' | 'CANCELLED';

export interface ShowtimeAttributes {
  id: number;
  cinemaId: number;
  movieId: number;
  startsAt: Date;
  room: string;
  roomType: string;
  format: string;
  language: string;
  audioType: 'DUBBED' | 'SUBTITLED' | 'ORIGINAL';
  price: number;
  status: ShowtimeStatus;
  availableSeats: number;
}

export interface ShowtimeCreationAttributes extends Optional<
  ShowtimeAttributes,
  'id' | 'roomType' | 'format' | 'language' | 'audioType' | 'status' | 'availableSeats'
> {}

class Showtime
  extends Model<ShowtimeAttributes, ShowtimeCreationAttributes>
  implements ShowtimeAttributes
{
  public id!: number;
  public cinemaId!: number;
  public movieId!: number;
  public startsAt!: Date;
  public room!: string;
  public roomType!: string;
  public format!: string;
  public language!: string;
  public audioType!: 'DUBBED' | 'SUBTITLED' | 'ORIGINAL';
  public price!: number;
  public status!: ShowtimeStatus;
  public availableSeats!: number;
}

Showtime.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cinemaId: { type: DataTypes.INTEGER, allowNull: false, field: 'cinema_id' },
    movieId: { type: DataTypes.INTEGER, allowNull: false, field: 'movie_id' },
    startsAt: { type: DataTypes.DATE, allowNull: false, field: 'starts_at' },
    room: { type: DataTypes.STRING(50), allowNull: false },
    roomType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'STANDARD',
      field: 'room_type',
    },
    format: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '2D' },
    language: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Español' },
    audioType: {
      type: DataTypes.ENUM('DUBBED', 'SUBTITLED', 'ORIGINAL'),
      allowNull: false,
      defaultValue: 'DUBBED',
      field: 'audio_type',
    },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'SOLD_OUT', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    availableSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'available_seats',
    },
  },
  {
    sequelize,
    modelName: 'Showtime',
    tableName: 'showtimes',
    timestamps: true,
    indexes: [{ fields: ['movie_id', 'starts_at'] }, { fields: ['cinema_id', 'starts_at'] }],
  },
);

export default Showtime;
