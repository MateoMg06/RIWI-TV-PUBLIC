// app/src/repositories/dim-membership-tier.repository.ts

// Repositorio simple para la tabla dim_membership_tier
// Solo hace consultas basicas, nada raro

import DimMembershipTier from '../models/dim_membership_tier.model';

class DimMembershipTierRepository {

  // trae todos los niveles ordenados por puntos
  async findAll() {
    const tiers = await DimMembershipTier.findAll({
      order: [['minium_points', 'ASC']],
    });
    return tiers;
  }

  // busca un nivel por su codigo (BRONCE, PLATA, ORO, PLATINO)
  async findByCode(tier_code: string) {
    const tier = await DimMembershipTier.findOne({ where: { tier_code } });
    return tier;
  }

  // busca el nivel que le toca a un usuario segun sus puntos
  // ejemplo: si tiene 600 puntos y plata pide 500, le toca plata
  async findByPoints(points: number) {
    const tiers = await DimMembershipTier.findAll({
      order: [['minium_points', 'ASC']],
    });

    // si no hay niveles en la bd, devolvemos null
    if (tiers.length === 0) {
      return null;
    }

    let miNivel = tiers[0];
    for (const tier of tiers) {
      if (points >= tier.minium_points) {
        miNivel = tier;
      }
    }
    return miNivel;
  }
}

export default new DimMembershipTierRepository();
