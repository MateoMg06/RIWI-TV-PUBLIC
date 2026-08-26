import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';
import Membership from './membership.model';

export interface PurchaseHistoryAttributes {
  id: number;
  userId: number;
  membershipId: number;
  amount: number;
  description: string;
  date: Date;
}

export interface PurchaseHistoryCreationAttributes extends Optional<PurchaseHistoryAttributes, 'id'> {}

class PurchaseHistory extends Model<PurchaseHistoryAttributes, PurchaseHistoryCreationAttributes> implements PurchaseHistoryAttributes {
  public id!: number;
  public userId!: number;
  public membershipId!: number;
  public amount!: number;
  public description!: string;
  public date!: Date;
}

PurchaseHistory.init(
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
    membershipId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'memberships',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'PurchaseHistory',
    tableName: 'purchase_histories',
    timestamps: true,
  }
);

export default PurchaseHistory;
