import Membership, { MembershipAttributes, MembershipCreationAttributes } from '../../models/membership.model';
import { Transaction } from 'sequelize';

export interface IMembershipRepository {
  create(data: MembershipCreationAttributes, transaction?: Transaction): Promise<Membership>;
  findByUserId(userId: number): Promise<Membership | null>;
  findByCode(code: string): Promise<Membership | null>;
  updateByUserId(userId: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null>;
  updateById(id: number, data: Partial<MembershipAttributes>, transaction?: Transaction): Promise<Membership | null>;
}
