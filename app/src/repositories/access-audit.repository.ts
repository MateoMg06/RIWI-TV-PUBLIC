import AccessAudit, { AccessAuditCreationAttributes } from '../models/access-audit.model';
import { IAccessAuditRepository } from './interfaces/access-audit.repository.interface';

class AccessAuditRepository implements IAccessAuditRepository {
  async create(data: AccessAuditCreationAttributes): Promise<AccessAudit> {
    return await AccessAudit.create(data);
  }

  async findByUserId(userId: number, limit = 50): Promise<AccessAudit[]> {
    return await AccessAudit.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  async findByAction(action: string, limit = 50): Promise<AccessAudit[]> {
    return await AccessAudit.findAll({
      where: { action: action as any },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }
}

export default new AccessAuditRepository();
