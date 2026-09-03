import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface RefreshTokenAttributes {
  id: number;
  userId: number;
  token: string;
  ipAddress: string | null;
  device: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revoked: boolean;
}

export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public ipAddress!: string | null;
  public device!: string | null;
  public userAgent!: string | null;
  public expiresAt!: Date;
  public revoked!: boolean;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
  }
);

export default RefreshToken;
