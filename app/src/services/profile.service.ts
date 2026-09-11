import ErrorHandler from '../error/errorHandler';
import profileRepository from '../repositories/profile.repository';
import membershipRepository from '../repositories/membership.repository';
import userService from './user.service';
import type { UpdateUserDto } from '../dto/update-user.dto';
import emailService from './email.service';

const benefitsByLevel = {
  BRONZE: { ticketDiscountPercent: 0, confectioneryDiscountPercent: 0, priorityAccess: false },
  SILVER: { ticketDiscountPercent: 5, confectioneryDiscountPercent: 0, priorityAccess: false },
  GOLD: { ticketDiscountPercent: 10, confectioneryDiscountPercent: 5, priorityAccess: true },
  PLATINUM: { ticketDiscountPercent: 15, confectioneryDiscountPercent: 10, priorityAccess: true },
} as const;

class ProfileService {
  async getProfile(userId: number) {
    const user = await profileRepository.findCompleteByUserId(userId);
    if (!user) throw new ErrorHandler(404, 'Perfil no encontrado');
    const plain = user.get({ plain: true }) as any;
    const membership = plain.userMembership;
    return {
      ...plain,
      membership: membership
        ? {
            ...membership,
            benefits: benefitsByLevel[membership.level as keyof typeof benefitsByLevel],
          }
        : null,
      userMembership: undefined,
    };
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const userFields: UpdateUserDto = {};
    for (const field of [
      'name',
      'email',
      'password',
      'lastName',
      'phone',
      'documentType',
      'documentNumber',
      'birthDate',
      'city',
      'acceptsNotifications',
    ] as const) {
      if (dto[field] !== undefined) (userFields as any)[field] = dto[field];
    }
    const updatedUser = Object.keys(userFields).length
      ? await userService.updateUser(userId, userFields)
      : null;
    if (dto.email !== undefined && updatedUser?.activationToken) {
      try {
        await emailService.sendActivationEmail(
          dto.email,
          updatedUser.activationToken,
          updatedUser.name,
        );
      } catch {
        // El token queda vigente para permitir reintentar el envío sin perder el cambio.
      }
    }
    const profileFields = {
      ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.documentType !== undefined ? { documentType: dto.documentType } : {}),
      ...(dto.documentNumber !== undefined ? { documentNumber: dto.documentNumber } : {}),
      ...(dto.birthDate !== undefined ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(dto.city !== undefined ? { city: dto.city } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.avatar !== undefined ? { avatar: dto.avatar } : {}),
    };
    if (Object.keys(profileFields).length)
      await profileRepository.updateByUserId(userId, profileFields);
    return this.getProfile(userId);
  }

  async getBenefits(userId: number) {
    const membership = await membershipRepository.findByUserId(userId);
    if (!membership) throw new ErrorHandler(404, 'Membresía no encontrada');
    return {
      code: membership.code,
      qrCode: membership.qrCode,
      level: membership.level,
      status: membership.status,
      bonusWallet: Number(membership.bonusWallet),
      discounts: benefitsByLevel[membership.level],
    };
  }
}

export default new ProfileService();
