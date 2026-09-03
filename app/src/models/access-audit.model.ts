import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type AccessAuditAction =
  | 'login'
  | 'login_failed'
  | 'refresh'
  | 'logout'
  | 'password_reset_requested'
  | 'password_reset'
  | 'account_activated';

export interface AccessAuditAttributes {
  id: number;
  userId: number | null;
  action: AccessAuditAction;
  ipAddress: string | null;
  device: string | null;
  userAgent: string | null;
  success: boolean;
  details: string | null;
}

export interface AccessAuditCreationAttributes extends Optional<AccessAuditAttributes, 'id'> {}

class AccessAudit extends Model<AccessAuditAttributes, AccessAuditCreationAttributes> implements AccessAuditAttributes {
  public id!: number;
  public userId!: number | null;
  public action!: AccessAuditAction;
  public ipAddress!: string | null;
  public device!: string | null;
  public userAgent!: string | null;
  public success!: boolean;
  public details!: string | null;
}

AccessAudit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    action: {
      type: DataTypes.ENUM(
        'login',
        'login_failed',
        'refresh',
        'logout',
        'password_reset_requested',
        'password_reset',
        'account_activated'
      ),
      allowNull: false,
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
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AccessAudit',
    tableName: 'access_audits',
    timestamps: true,
    updatedAt: false,
  }
);

export default AccessAudit;
