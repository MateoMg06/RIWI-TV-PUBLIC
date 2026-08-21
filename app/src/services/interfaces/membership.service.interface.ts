// app/src/services/interfaces/membership.service.interface.ts

import { CreateMembershipDto } from "../../dto/create-membership.dto";

export interface IMembershipService {
    create(data: CreateMembershipDto): Promise<any>;

    getAll(): Promise<any[]>;

    getByUserName(name: string): Promise<any>;

}
