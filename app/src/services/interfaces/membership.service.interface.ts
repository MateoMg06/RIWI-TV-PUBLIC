// app/src/services/interfaces/membership.service.interface.ts

import { CreateTypeMembershipDto } from "../dto/create-typeMembership.dto";

export interface IMembershipService {
    create(data: CreateTypeMembershipDto): Promise<any>;

    getAll(): Promise<any[]>;

    getByUserName(name: string): Promise<any>;

}
