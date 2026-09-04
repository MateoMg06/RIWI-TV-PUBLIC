import User, { UserAttributes, UserCreationAttributes } from '../../models/user.model';

export interface IUserRepository {
  create(data: UserCreationAttributes): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(email: string): Promise<User | null>;
  findUserCredential(email: string, password?: string): Promise<User | null>;
  findByID(id: number): Promise<User | null>;
  updateByID(id: number, data: Partial<UserAttributes>): Promise<void>;
}