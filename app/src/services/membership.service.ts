import User from '../models/user.model';
import membershipRepository from '../repositories/membership.repository';
import purchaseHistoryRepository from '../repositories/purchase-history.repository';
import userRepository from '../repositories/user.repository';
import { CreateMembershipDto } from '../dto/create-membership.dto';
import ErrorHandler from '../error/errorHandler';
import { Transaction } from 'sequelize';

class MembershipService {
  async createMembership(dto: CreateMembershipDto): Promise<{ message: string; membershipCode: string }> {
    // Verificar que el usuario existe
    const user = await userRepository.findByID(dto.userId);
    if (!user) {
      throw new ErrorHandler(404, 'Usuario no encontrado');
    }

    // Verificar que el usuario no tenga ya una membresía
    const existingMembership = await membershipRepository.findByUserId(dto.userId);
    if (existingMembership) {
      throw new ErrorHandler(400, 'El usuario ya tiene una membresía activa');
    }

    // Generar código único de membresía
    const membershipCode = this.generateMembershipCode();

    // Calcular fechas
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + dto.durationMonths);

    const transaction = await User.sequelize?.transaction();

    try {
      // Crear membresía
      const membership = await membershipRepository.create({
        userId: dto.userId,
        code: membershipCode,
        status: 'active',
        startDate: now,
        endDate: endDate,
        bonusWallet: dto.initialBonus || 0,
      }, transaction);

      // Crear historial de compra
      await purchaseHistoryRepository.create({
        userId: dto.userId,
        membershipId: membership.id,
        amount: 0,
        description: `Creación de membresía ${membershipCode}`,
        date: now,
      }, transaction);

      // Actualizar usuario
      await userRepository.updateByID(dto.userId, {
        membership: 'premium',
      }, transaction);

      await transaction?.commit();

      return {
        message: 'Membresía creada exitosamente',
        membershipCode: membership.code,
      };
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async getMembershipByUserId(userId: number) {
    const membership = await membershipRepository.findByUserId(userId);
    if (!membership) {
      throw new ErrorHandler(404, 'Membresía no encontrada');
    }
    return membership;
  }

  async getPurchaseHistory(userId: number) {
    const user = await userRepository.findByID(userId);
    if (!user) {
      throw new ErrorHandler(404, 'Usuario no encontrado');
    }

    const history = await purchaseHistoryRepository.findByUserId(userId);
    return history;
  }

  private generateMembershipCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'MEM-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export default new MembershipService();
