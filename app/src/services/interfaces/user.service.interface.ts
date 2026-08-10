import User from '../../models/user.model';
import { CreateUserDto } from '../../dto/create-user.dto';

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(email: string): Promise<User | null>;
  findCredential(email: string, password: string): Promise<User | null>;
}