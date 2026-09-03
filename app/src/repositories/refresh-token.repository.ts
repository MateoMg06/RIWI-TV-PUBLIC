import RefreshToken, { RefreshTokenAttributes, RefreshTokenCreationAttributes } from '../models/refresh-token.model';
import { IRefreshTokenRepository } from './interfaces/refresh-token.repository.interface';
import { Transaction, Op } from 'sequelize';

class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: RefreshTokenCreationAttributes, transaction?: Transaction): Promise<RefreshToken> {
    return await RefreshToken.create(data, { transaction });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ where: { token } });
  }

  async findByUserId(userId: number): Promise<RefreshToken[]> {
    return await RefreshToken.findAll({ where: { userId, revoked: false } });
  }

  async revokeByUserId(userId: number, transaction?: Transaction): Promise<void> {
    await RefreshToken.update(
      { revoked: true },
      { where: { userId, revoked: false }, transaction }
    );
  }

  async revokeByToken(token: string, transaction?: Transaction): Promise<void> {
    await RefreshToken.update(
      { revoked: true },
      { where: { token }, transaction }
    );
  }

  async revokeExpired(): Promise<number> {
    const [count] = await RefreshToken.update(
      { revoked: true },
      { where: { expiresAt: { [Op.lt]: new Date() }, revoked: false } }
    );
    return count;
  }

  async deleteByUserId(userId: number, transaction?: Transaction): Promise<void> {
    await RefreshToken.destroy({ where: { userId }, transaction });
  }
}

export default new RefreshTokenRepository();
