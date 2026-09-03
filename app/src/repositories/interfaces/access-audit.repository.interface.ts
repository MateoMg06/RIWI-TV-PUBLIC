import AccessAudit, { AccessAuditAttributes, AccessAuditCreationAttributes } from '../../models/access-audit.model';

export interface IAccessAuditRepository {
  create(data: AccessAuditCreationAttributes): Promise<AccessAudit>;
  findByUserId(userId: number, limit?: number): Promise<AccessAudit[]>;
  findByAction(action: string, limit?: number): Promise<AccessAudit[]>;
}
