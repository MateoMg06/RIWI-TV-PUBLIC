import Profile, { ProfileAttributes, ProfileCreationAttributes } from '../../models/profile.model';
import { Transaction } from 'sequelize';

export interface IProfileRepository {
  create(data: ProfileCreationAttributes, transaction?: Transaction): Promise<Profile>;
  findByUserId(userId: number): Promise<Profile | null>;
  updateByUserId(userId: number, data: Partial<ProfileAttributes>, transaction?: Transaction): Promise<Profile | null>;
}
