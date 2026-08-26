import User, { UserAttributes, UserCreationAttributes } from '../../models/user.model';
import { Transaction } from 'sequelize';

export interface IUserRepository {
  create(data: UserCreationAttributes, transaction?: Transaction): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(email: string): Promise<User | null>;
  findUserCredential(email: string, password?: string): Promise<User | null>;
  findByID(id: number): Promise<User | null>;
  findByActivationToken(token: string): Promise<User | null>;
  updateByID(id: number, data: Partial<UserAttributes>, transaction?: Transaction): Promise<void>;
}
