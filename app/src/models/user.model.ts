import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "usuario";
  membership: string;
  failedLoginAttempts: number;
  lastLoginAttempt: Date | null;
  lockedUntil: Date | null;
  phone: string;
  documentType: string;
  documentNumber: string;
  birthDate: Date;
  city: string;
  acceptsDataProcessing: boolean;
  acceptsTerms: boolean;
  acceptsNotifications: boolean;
  accountStatus: "active" | "inactive";
  activationToken: string | null;
  activationTokenExpires: Date | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "usuario";
  public membership!: string;
  public failedLoginAttempts!: number;
  public lastLoginAttempt!: Date | null;
  public lockedUntil!: Date | null;
  public phone!: string;
  public documentType!: string;
  public documentNumber!: string;
  public birthDate!: Date;
  public city!: string;
  public acceptsDataProcessing!: boolean;
  public acceptsTerms!: boolean;
  public acceptsNotifications!: boolean;
  public accountStatus!: "active" | "inactive";
  public activationToken!: string | null;
  public activationTokenExpires!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "usuario"),
      allowNull: false,
      defaultValue: 'usuario',
    },
    membership: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'básica',
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lastLoginAttempt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
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
    acceptsDataProcessing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptsTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptsNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    accountStatus: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: 'inactive',
    },
    activationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    activationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
