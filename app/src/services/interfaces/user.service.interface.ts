import User from '../../models/user.model';
import { UpdateUserDto } from '../../dto/update-user.dto';

export interface IUserService {
  findAll(): Promise<User[]>;
  findOne(email: string): Promise<User | null>;
  findCredential(email: string, password: string): Promise<User | null>;
  registerFailedAttempt(user: User): Promise<void>;
  clearAttempts(user: User): Promise<void>;
  updateUser(id: number, dto: UpdateUserDto): Promise<User | null>;
  setLocation(userId: number, cityId: number): Promise<User>;
}
