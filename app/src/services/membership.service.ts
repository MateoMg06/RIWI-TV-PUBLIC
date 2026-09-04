// app/src/services/membership.service.ts

// Servicio de membresias
// Aqui va la logica del negocio: niveles, descuentos, QR y beneficios
// Esta hecho simple a proposito para que se entienda facil

import User from '../models/user.model';
import Qr from '../models/qr.model';
import QRCode from 'qrcode';
import membershipRepository from "../repositories/membership.repository";
import dimTierRepository from "../repositories/dim-membership-tier.repository";
import { CreateTypeMembershipDto } from "../dto/create-typeMembership.dto";
import { IMembershipService } from "./interfaces/membership.service.interface";
import purchaseHistoryRepository from '../repositories/purchase-history.repository';
import userRepository from '../repositories/user.repository';
import { CreateMembershipDto } from '../dto/create-membership.dto';
import errorhandler from '../error/errorHandler';

class MembershipService implements IMembershipService {

    async create(data: CreateTypeMembershipDto) {
        // lo paso como any porque el repo acepta varios tipos de dto
        return await membershipRepository.create(data as any);
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

    async createMembership(dto: CreateMembershipDto): Promise<{ message: string; membershipCode: string }> {
        const user = await userRepository.findByID(dto.userId);
        if (!user) {
            throw new errorhandler(404, 'Usuario no encontrado');
        }

        const existingMembership = await membershipRepository.findByUserId(dto.userId);
        if (existingMembership) {
            throw new errorhandler(400, 'El usuario ya tiene una membresía activa');
        }

        const membershipCode = this.generateMembershipCode();

        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + dto.durationMonths);

        const transaction = await User.sequelize?.transaction();

        try {
            const membership = await membershipRepository.create({
                userId: dto.userId,
                membershipType: dto.membershipType || 'standard',
                code: membershipCode,
                status: 'active',
                startDate: now,
                endDate: endDate,
                bonusWallet: dto.initialBonus || 0,
            }, transaction);

            await purchaseHistoryRepository.create({
                userId: dto.userId,
                membershipId: membership.id,
                amount: 0,
                description: `Creación de membresía ${membershipCode}`,
                date: now,
            }, transaction);

            // creo el QR de una vez para que el usuario ya tenga su QR visible
            // el QR es unico e intransferible porque va amarrado al membershipId
            const qrToken = await this.generateUniqueQrToken();
            await Qr.create({
                membershipId: membership.id,
                token: qrToken,
                status: 'active',
            }, { transaction });

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

    // Este es el GET /membership (info personal completa)
    // Devuelve QR, nivel, descuentos, historiales y reservas
    async getMembershipByUserId(userId: number) {
        const membership: any = await membershipRepository.findByUserId(userId);
        if (!membership) {
            throw new errorhandler(404, 'Membresía no encontrada');
        }

        // saco los puntos del bonusWallet (si no hay, son 0)
        let points = 0;
        try {
            points = parseFloat(String(membership.bonusWallet)) || 0;
        } catch (e) {
            points = 0;
        }

        // busco el nivel que le toca por puntos
        const tier = await this.getTierByPoints(points);

        // calculo el descuento segun el nivel
        const discount = this.getDiscountByTierCode(tier.tier_code);

        // busco o creo el QR (siempre debe haber uno visible)
        const qr = await this.getOrCreateQr(membership.id, membership.code);
        const qrImage = await this.buildQrImage(qr.token);

        // historial de compras real de la bd
        let purchaseHistory: any[] = [];
        try {
            purchaseHistory = await purchaseHistoryRepository.findByUserId(userId);
        } catch (e) {
            purchaseHistory = [];
        }

        // historial de puntos (por ahora lo saco de las compras, no hay tabla de puntos)
        const pointsHistory = this.buildPointsHistory(purchaseHistory, points);

        // reservas activas (todavia no hay tabla de reservas, devuelvo lista vacia)
        const activeReservations: any[] = [];

        // beneficios vigentes de este nivel
        const benefits = this.getBenefitsByTierCode(tier.tier_code);

        // devuelvo todo junto, y tambien dejo los campos viejos arriba
        // para no romper lo que ya existia (membershipType, code, etc)
        const membershipData = typeof membership.toJSON === 'function' ? membership.toJSON() : membership;

        return {
            ...membershipData,
            qr: {
                token: qr.token,
                status: qr.status,
                image: qrImage,
            },
            nivel: {
                code: tier.tier_code,
                name: tier.tier_name,
                minium_points: tier.minium_points,
            },
            descuento: discount,
            descuentosVigentes: [
                { nivel: tier.tier_name, porcentaje: discount, activo: true },
            ],
            beneficios: benefits,
            historialCompras: purchaseHistory,
            historialPuntos: pointsHistory,
            reservasActivas: activeReservations,
            puntosActuales: points,
        };
    }

    // Este es el GET /membership/benefits (solo beneficios vigentes + QR)
    async getBenefits(userId: number) {
        const membership: any = await membershipRepository.findByUserId(userId);
        if (!membership) {
            throw new errorhandler(404, 'Membresía no encontrada');
        }

        let points = 0;
        try {
            points = parseFloat(String(membership.bonusWallet)) || 0;
        } catch (e) {
            points = 0;
        }

        const tier = await this.getTierByPoints(points);
        const discount = this.getDiscountByTierCode(tier.tier_code);
        const benefits = this.getBenefitsByTierCode(tier.tier_code);

        // el QR siempre tiene que estar visible
        const qr = await this.getOrCreateQr(membership.id, membership.code);
        const qrImage = await this.buildQrImage(qr.token);

        // solo devuelvo los beneficios que estan vigentes (activos)
        const vigentes = benefits.filter((b: any) => b.activo === true);

        return {
            nivel: {
                code: tier.tier_code,
                name: tier.tier_name,
                minium_points: tier.minium_points,
            },
            descuento: discount,
            beneficiosVigentes: vigentes,
            qr: {
                token: qr.token,
                status: qr.status,
                image: qrImage,
            },
            puntosActuales: points,
        };
    }

    async getPurchaseHistory(userId: number) {
        const user = await userRepository.findByID(userId);
        if (!user) {
            throw new errorhandler(404, 'Usuario no encontrado');
        }

        const history = await purchaseHistoryRepository.findByUserId(userId);
        return history;
    }

    // ---------- funciones de ayuda (privadas) ----------

    private generateMembershipCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'MEM-';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // genera un token unico para el QR, revisa que no exista
    private async generateUniqueQrToken(): Promise<string> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        // intento 5 veces por si se repite
        for (let intento = 0; intento < 5; intento++) {
            let token = 'QR-MEM-';
            for (let i = 0; i < 10; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const existe = await Qr.findOne({ where: { token } });
            if (!existe) {
                return token;
            }
        }
        // si despues de 5 intentos se repitio todo, agrego la fecha para hacerlo unico
        return 'QR-MEM-' + Date.now().toString() + Math.floor(Math.random() * 9999).toString();
    }

    // busca el nivel por puntos, si la bd falla usa los valores fijos
    private async getTierByPoints(points: number) {
        try {
            const tier = await dimTierRepository.findByPoints(points);
            if (tier) {
                return {
                    tier_code: tier.tier_code,
                    tier_name: tier.tier_name,
                    minium_points: tier.minium_points,
                };
            }
        } catch (e) {
            // si la tabla no existe todavia, sigo con los valores fijos
            console.log('No se pudo leer dim_membership_tier, uso niveles fijos');
        }

        // niveles fijos por si la bd esta vacia
        if (points >= 3000) {
            return { tier_code: 'PLATINO', tier_name: 'Platino', minium_points: 3000 };
        }
        if (points >= 1500) {
            return { tier_code: 'ORO', tier_name: 'Oro', minium_points: 1500 };
        }
        if (points >= 500) {
            return { tier_code: 'PLATA', tier_name: 'Plata', minium_points: 500 };
        }
        return { tier_code: 'BRONCE', tier_name: 'Bronce', minium_points: 0 };
    }

    // regla del negocio: el descuento depende del nivel
    private getDiscountByTierCode(tierCode: string): number {
        if (tierCode === 'PLATINO') {
            return 20;
        }
        if (tierCode === 'ORO') {
            return 15;
        }
        if (tierCode === 'PLATA') {
            return 10;
        }
        // bronce o cualquier otro
        return 5;
    }

    // beneficios por nivel, todos vigentes (activo: true)
    private getBenefitsByTierCode(tierCode: string) {
        if (tierCode === 'PLATINO') {
            return [
                { nombre: '20% de descuento en boletería', activo: true },
                { nombre: '2x1 en confitería los martes', activo: true },
                { nombre: 'Acceso a preestrenos', activo: true },
                { nombre: 'Silla preferencial sin costo', activo: true },
            ];
        }
        if (tierCode === 'ORO') {
            return [
                { nombre: '15% de descuento en boletería', activo: true },
                { nombre: '2x1 en confitería los martes', activo: true },
                { nombre: 'Acceso a preestrenos', activo: true },
            ];
        }
        if (tierCode === 'PLATA') {
            return [
                { nombre: '10% de descuento en boletería', activo: true },
                { nombre: 'Acumula puntos por cada compra', activo: true },
            ];
        }
        // bronce
        return [
            { nombre: '5% de descuento en boletería', activo: true },
            { nombre: 'Acumula puntos por cada compra', activo: true },
        ];
    }

    // busca el QR y si no existe lo crea (siempre debe haber uno)
    private async getOrCreateQr(membershipId: number, membershipCode: string) {
        let qr = await Qr.findOne({ where: { membershipId } });
        if (!qr) {
            const token = await this.generateUniqueQrToken();
            qr = await Qr.create({
                membershipId: membershipId,
                token: token,
                status: 'active',
            });
        }
        return qr;
    }

    // genera la imagen del QR para mostrarla en el perfil
    private async buildQrImage(token: string): Promise<string | null> {
        try {
            const imagen = await QRCode.toDataURL(token);
            return imagen;
        } catch (e) {
            console.log('No se pudo generar la imagen QR, devuelvo solo el token');
            return null;
        }
    }

    // arma un historial de puntos simple basado en las compras
    private buildPointsHistory(purchaseHistory: any[], puntosActuales: number) {
        const historial: any[] = [];
        for (const compra of purchaseHistory) {
            let monto = 0;
            try {
                monto = parseFloat(String((compra as any).amount)) || 0;
            } catch (e) {
                monto = 0;
            }
            // regla simple: 1 punto por cada 1000 pesos
            const puntos = Math.floor(monto / 1000);
            historial.push({
                fecha: (compra as any).date,
                descripcion: (compra as any).description,
                puntos: puntos,
            });
        }
        // agrego el saldo actual al final
        historial.push({
            fecha: new Date(),
            descripcion: 'Saldo actual de puntos',
            puntos: puntosActuales,
        });
        return historial;
    }
}
    export default new MembershipService();
