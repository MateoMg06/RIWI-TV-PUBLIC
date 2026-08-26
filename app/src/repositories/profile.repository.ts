import Profile, { ProfileAttributes, ProfileCreationAttributes } from '../models/profile.model';
import type { IProfileRepository } from './interfaces/profile.repository.interface';
import { Transaction } from 'sequelize';

class ProfileRepository implements IProfileRepository {
  async create(data: ProfileCreationAttributes, transaction?: Transaction): Promise<Profile> {
    return await Profile.create(data, { transaction });
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    return await Profile.findOne({ where: { userId } });
  }

  async updateByUserId(userId: number, data: Partial<ProfileAttributes>, transaction?: Transaction): Promise<Profile | null> {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) return null;
    await profile.update(data, { transaction });
    return profile;
  }
}

export default new ProfileRepository();
