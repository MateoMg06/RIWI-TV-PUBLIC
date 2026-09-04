// app/src/services/interfaces/membership.service.interface.ts

import { CreateTypeMembershipDto } from "../../dto/create-typeMembership.dto";
import { CreateMembershipDto } from '../../dto/create-membership.dto';

export interface IMembershipService {
    create(data: CreateTypeMembershipDto): Promise<any>;

    getAll(): Promise<any[]>;

    getByUserName(name: string): Promise<any>;

    createMembership(dto: CreateMembershipDto): Promise<{ message: string; membershipCode: string }>;
    getMembershipByUserId(userId: number): Promise<any>;
    getPurchaseHistory(userId: number): Promise<any[]>;
    getBenefits(userId: number): Promise<any>;
}
