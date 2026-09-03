import PasswordResetToken, { PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes } from '../models/password-reset-token.model';
import { IPasswordResetTokenRepository } from './interfaces/password-reset-token.repository.interface';
import { Transaction } from 'sequelize';

class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  async create(data: PasswordResetTokenCreationAttributes, transaction?: Transaction): Promise<PasswordResetToken> {
    return await PasswordResetToken.create(data, { transaction });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return await PasswordResetToken.findOne({ where: { token } });
  }

  async findByUserId(userId: number): Promise<PasswordResetToken[]> {
    return await PasswordResetToken.findAll({ where: { userId } });
  }

  async invalidateByUserId(userId: number, transaction?: Transaction): Promise<void> {
    await PasswordResetToken.update(
      { used: true },
      { where: { userId, used: false }, transaction }
    );
  }

  async markAsUsed(token: string, transaction?: Transaction): Promise<void> {
    await PasswordResetToken.update(
      { used: true },
      { where: { token }, transaction }
    );
  }
}

export default new PasswordResetTokenRepository();
