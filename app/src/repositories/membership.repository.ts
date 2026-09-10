import Membership, { MembershipAttributes, MembershipCreationAttributes } from '../models/membership.model';
import { IMembershipRepository } from './interfaces/membership.repository.interface';
import { Transaction } from 'sequelize';

class MembershipRepository implements IMembershipRepository {
  async create(data: MembershipCreationAttributes, transaction?: Transaction): Promise<Membership> {
    return await Membership.create(data, { transaction });
  }

  async findByUserId(userId: number): Promise<Membership | null> {
    return await Membership.findOne({ where: { userId } });
  }

  async findByCode(code: string): Promise<Membership | null> {
    return await Membership.findOne({ where: { code } });
  }

  async updateByUserId(userId: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null> {
    const membership = await Membership.findOne({ where: { userId } });
    if (!membership) return null;
    await membership.update(data, { transaction });
    return membership;
  }

  async updateById(id: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null> {
    const membership = await Membership.findByPk(id);
    if (!membership) return null;
    await membership.update(data, { transaction });
    return membership;
  }
}

export default new MembershipRepository();
