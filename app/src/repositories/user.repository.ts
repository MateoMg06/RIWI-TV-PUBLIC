import User, { UserCreationAttributes } from '../models/user.model';
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
}

export default new UserRepository();
