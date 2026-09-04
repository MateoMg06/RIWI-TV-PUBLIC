import RefreshToken, { RefreshTokenAttributes, RefreshTokenCreationAttributes} from "../../models/refresh-token.model";
import { Transaction } from "sequelize";

export interface IRefreshTokenRepository {
    create(data: RefreshTokenCreationAttributes, transaction: Transaction): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    findByUserId(userId: number): Promise<RefreshToken[]>;
    revokeByUserId(userId: number, transaction?: Transaction): Promise<void>;
    revokeByToken(token: string, transaction?: Transaction): Promise<void>;
    revokeExpired(): Promise<number>;
    deleteByUserId(userId: number, transaction?: Transaction): Promise<void>;
}