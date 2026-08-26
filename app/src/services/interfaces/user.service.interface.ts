import User from '../../models/user.model';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(email: string): Promise<User | null>;
  findCredential(email: string, password: string): Promise<User | null>;
  registerFailedAttempt(user: User): Promise<void>;
  clearAttempts(user: User): Promise<void>;
  updateUser(id: number, dto: UpdateUserDto): Promise<User | null>
}