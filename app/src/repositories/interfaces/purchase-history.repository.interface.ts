import PurchaseHistory, { PurchaseHistoryAttributes, PurchaseHistoryCreationAttributes } from '../../models/purchase-history.model';
import { Transaction } from 'sequelize';

export interface IPurchaseHistoryRepository {
  create(data: PurchaseHistoryCreationAttributes, transaction?: Transaction): Promise<PurchaseHistory>;
  findByUserId(userId: number): Promise<PurchaseHistory[]>;
  findByMembershipId(membershipId: number): Promise<PurchaseHistory[]>;
}
