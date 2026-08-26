import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

export interface MembershipAttributes {
  id: number;
  userId: number;
  code: string;
  status: "active" | "inactive" | "expired" | "pending";
  startDate: Date;
  endDate: Date;
  bonusWallet: number;
}

export interface MembershipCreationAttributes extends Optional<MembershipAttributes, 'id'> {}

class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  public id!: number;
  public userId!: number;
  public code!: string;
  public status!: "active" | "inactive" | "expired" | "pending";
  public startDate!: Date;
  public endDate!: Date;
  public bonusWallet!: number;
}

Membership.init(
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
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "expired", "pending"),
      allowNull: false,
      defaultValue: 'pending',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bonusWallet: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    modelName: 'Membership',
    tableName: 'memberships',
    timestamps: true,
  }
);

export default Membership;
