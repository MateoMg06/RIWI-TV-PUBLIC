import User, { UserAttributes, UserCreationAttributes } from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';
import { Transaction } from 'sequelize';

class UserRepository implements IUserRepository {
  async create(data: UserCreationAttributes, transaction?: Transaction): Promise<User> {
    return await User.create(data, { transaction });
  }

  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  async findOne(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findUserCredential(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findByID(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async findByActivationToken(token: string): Promise<User | null> {
    return await User.findOne({ where: { activationToken: token } });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await User.findOne({ where: { resetToken: token } });
  }

  async updateByID(id: number, data: Partial<UserAttributes>, transaction?: Transaction): Promise<void> {
    await User.update(data, { where: { id }, transaction });
  }

  async saveAccessToken(id: number, accessToken: string): Promise<void> {
    await User.update({ accessToken }, { where: { id } });
  }

  async saveRefreshToken(id: number, refreshToken: string): Promise<void> {
    await User.update({ refreshToken }, { where: { id } });
  }

  async clearTokens(id: number): Promise<void> {
    await User.update({ accessToken: null, refreshToken: null }, { where: { id } });
  }
}

export default new UserRepository();
