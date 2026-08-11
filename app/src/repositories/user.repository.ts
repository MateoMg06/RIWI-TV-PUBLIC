import User, { UserAttributes, UserCreationAttributes } from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';

class UserRepository implements IUserRepository {
  async create(data: UserCreationAttributes): Promise<User> {
    return await User.create(data);
  }

  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  async findOne(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findUserCredential(email: string, password?: string): Promise<User | null> {
    if (password) {
      return await User.findOne({ where: { email, password } });
    }

    return await User.findOne({ where: { email } });
  }
  
  async updateByID(id: number, data: Partial<UserAttributes>): Promise<void> {
    await User.update(data, {where: {id}})
  }
}

export default new UserRepository();
