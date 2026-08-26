import PurchaseHistory, { PurchaseHistoryAttributes, PurchaseHistoryCreationAttributes } from '../models/purchase-history.model';
import { IPurchaseHistoryRepository } from './interfaces/purchase-history.repository.interface';
import { Transaction } from 'sequelize';

class PurchaseHistoryRepository implements IPurchaseHistoryRepository {
  async create(data: PurchaseHistoryCreationAttributes, transaction?: Transaction): Promise<PurchaseHistory> {
    return await PurchaseHistory.create(data, { transaction });
  }

  async findByUserId(userId: number): Promise<PurchaseHistory[]> {
    return await PurchaseHistory.findAll({ where: { userId }, order: [['date', 'DESC']] });
  }

  async findByMembershipId(membershipId: number): Promise<PurchaseHistory[]> {
    return await PurchaseHistory.findAll({ where: { membershipId }, order: [['date', 'DESC']] });
  }
}

export default new PurchaseHistoryRepository();
