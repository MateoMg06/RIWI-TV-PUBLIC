import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

export interface ProfileAttributes {
  id: number;
  userId: number;
  lastName: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  birthDate: Date;
  city: string;
  address?: string;
  avatar?: string;
}

export interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public userId!: number;
  public lastName!: string;
  public phone!: string;
  public documentType!: string;
  public documentNumber!: string;
  public birthDate!: Date;
  public city!: string;
  public address?: string;
  public avatar?: string;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true,
  }
);

export default Profile;
