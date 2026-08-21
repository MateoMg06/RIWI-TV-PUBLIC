// app/src/services/membership.service.ts

import membershipRepository from "../repositories/membership.repository";
import { CreateMembershipDto } from "../dto/create-membership.dto";
import { IMembershipService } from "./interfaces/membership.service.interface";

class MembershipService implements IMembershipService {

    async create(data: CreateMembershipDto) {
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