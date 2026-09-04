import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PasswordResetTokenAttributes {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  used: boolean;
}

export interface PasswordResetTokenCreationAttributes extends Optional<PasswordResetTokenAttributes, 'id'> {}

class PasswordResetToken extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes> implements PasswordResetTokenAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public used!: boolean;
}

PasswordResetToken.init(
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
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'PasswordResetToken',
    tableName: 'password_reset_tokens',
    timestamps: true,
  }
);

export default PasswordResetToken;
