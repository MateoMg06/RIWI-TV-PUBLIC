import PasswordResetToken, { PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes } from '../../models/password-reset-token.model';
import { Transaction } from 'sequelize';

export interface IPasswordResetTokenRepository {
  create(data: PasswordResetTokenCreationAttributes, transaction?: Transaction): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  findByUserId(userId: number): Promise<PasswordResetToken[]>;
  invalidateByUserId(userId: number, transaction?: Transaction): Promise<void>;
  markAsUsed(token: string, transaction?: Transaction): Promise<void>;
}
