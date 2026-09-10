import { CreateMembershipDto } from '../../dto/create-membership.dto';

export interface IMembershipService {
  createMembership(dto: CreateMembershipDto): Promise<{ message: string; membershipCode: string }>;
  getMembershipByUserId(userId: number): Promise<any>;
  getPurchaseHistory(userId: number): Promise<any[]>;
}
