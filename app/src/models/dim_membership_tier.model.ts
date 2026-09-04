// app/src/models/dim_membership_tier.model.ts

// Modelo de la tabla dim_membership_tier
// Esta tabla guarda los niveles de membresia: bronce, plata, oro y platino
// La hizo un dev junior, por eso esta todo simple y con comentarios

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Estos son los atributos que pidieron para la entidad
export interface DimMembershipTierAttributes {
  membership_tier_key: number;
  tier_code: string;
  tier_name: string;
  minium_points: number;
}

// Para crear no pedimos la llave porque es automatica
export interface DimMembershipTierCreationAttributes extends Optional<DimMembershipTierAttributes, "membership_tier_key"> {}

class DimMembershipTier extends Model<DimMembershipTierAttributes, DimMembershipTierCreationAttributes> implements DimMembershipTierAttributes {
  public membership_tier_key!: number;
  public tier_code!: string;
  public tier_name!: string;
  public minium_points!: number;
}

DimMembershipTier.init(
  {
    membership_tier_key: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tier_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    tier_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    minium_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "DimMembershipTier",
    tableName: "dim_membership_tier",
    timestamps: true,
  }
);

export default DimMembershipTier;
