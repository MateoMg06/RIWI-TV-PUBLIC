// app/src/services/membership.service.ts

import membershipRepository from "../repositories/membership.repository";
import { CreateTypeMembershipDto } from "../dto/create-typeMembership.dto";
import { IMembershipService } from "./interfaces/membership.service.interface";

class MembershipService implements IMembershipService {

    async create(data: CreateTypeMembershipDto) {
        return await membershipRepository.create(data);
    }

    async getAll() {
        return await membershipRepository.findAll();
    }



    async getByUserName(name: string) {
        const membership = await membershipRepository.findByUserName(name);

        if (!membership) {
            throw new Error("Membresía no encontrada para ese usuario");
        }

        return membership;
    }
}
    export default new MembershipService();