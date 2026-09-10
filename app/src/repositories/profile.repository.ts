import Profile, { ProfileAttributes, ProfileCreationAttributes } from '../models/profile.model';
import type { IProfileRepository } from './interfaces/profile.repository.interface';
import { Transaction } from 'sequelize';
import User from '../models/user.model';
import Membership from '../models/membership.model';
import PurchaseHistory from '../models/purchase-history.model';

class ProfileRepository implements IProfileRepository {
  async create(data: ProfileCreationAttributes, transaction?: Transaction): Promise<Profile> {
    return await Profile.create(data, { transaction });
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    return await Profile.findOne({ where: { userId } });
  }

  async updateByUserId(
    userId: number,
    data: Partial<ProfileAttributes>,
    transaction?: Transaction,
  ): Promise<Profile | null> {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) return null;
    await profile.update(data, { transaction });
    return profile;
  }

  async findCompleteByUserId(userId: number): Promise<User | null> {
    return User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'accessToken', 'refreshToken', 'resetToken', 'activationToken'],
      },
      include: [
        { model: Profile, as: 'profile' },
        { model: Membership, as: 'userMembership' },
        {
          model: PurchaseHistory,
          as: 'purchaseHistories',
          separate: true,
          order: [['date', 'DESC']],
        },
      ],
    });
  }
}

export default new ProfileRepository();
