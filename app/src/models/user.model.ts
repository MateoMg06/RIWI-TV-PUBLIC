import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "usuario";
  membership: string;
  failedLoginAttempts: number;
  lastLoginAttempt: Date | null;
  lockedUntil: Date | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "usuario";
  public membership!: string;
  public failedLoginAttempts!: number;
  public lastLoginAttempt!: Date | null;
  public lockedUntil!: Date | null;

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
      allowNull: false,
      defaultValue: null
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null
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
