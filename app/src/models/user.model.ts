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
  cityId: number | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'cityId' | 'failedLoginAttempts' | 'lastLoginAttempt' | 'lockedUntil'> {}

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
  public cityId!: number | null;

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
      allowNull: true,
      defaultValue: null
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: 'city_id',
      references: { model: 'cities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
