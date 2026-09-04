// app/src/controllers/membership.controller.ts

import { Request, Response } from "express";
import membershipService from "../services/membership.service";
import Membership from "../models/membership.model";
import MembershipRepository from "../repositories/membership.repository";
import { CreateMembershipDto } from "../dto/create-membership.dto";
import errorhandler from "../error/errorHandler";

/**
 * Controlador de Membresías
 * -------------------------
 * Maneja las solicitudes HTTP relacionadas con la entidad Membership.
 *
 * Recibe el Request/Response de Express, delega la lógica de negocio
 * al service, y construye la respuesta HTTP correspondiente.
 */


    /**
     * POST /memberships
     * Crea una nueva membresía.
     */
   export const create = async (req: Request, res: Response): Promise<void> => {
        try {
            const membership = await membershipService.create(req.body);
            res.status(201).json(membership);
        } catch (error) {
            res.status(500).json({
                message: "Error al crear la membresía",
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    /**
     * GET /memberships
     * Obtiene la lista completa de membresías.
     */
    export const getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const memberships = await membershipService.getAll();
            res.status(200).json(memberships);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener la lista de membresías",
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    /**
     * GET /memberships/:name
     * Obtiene una membresía por nombre de usuario.
     */
    export const getByUserName = async (req: Request, res: Response): Promise<void> => {
        try {
            const name = Array.isArray(req.params.name)
                ? req.params.name[0] 
                : req.params.name;

            if (!name || name.trim() === "") {
                res.status(400).json({
                    message: "Nombre de usuario inválido"
                });
                return;
            }

            const membership = await membershipService.getByUserName(name);
            res.status(200).json(membership);
        } catch (error) {
            res.status(404).json({
                message: error instanceof Error
                 ? error.message : "Membresía no encontrada",
            });
        }
    }

export const createMembership = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const dto: CreateMembershipDto = {
      ...req.body,
      userId: req.user.id,
    };
    const result = await membershipService.createMembership(dto);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getMembership = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const membership = await membershipService.getMembershipByUserId(req.user.id);
    return res.status(200).json(membership);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getPurchaseHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const history = await membershipService.getPurchaseHistory(req.user.id);
    return res.status(200).json(history);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// GET /membership/benefits
// Devuelve los beneficios vigentes, el nivel, el descuento y el QR visible
// Esto es lo que el usuario ve en su perfil antes de comprar
export const getBenefits = async (req: Request, res: Response): Promise<Response> => {
  try {
    // reviso que venga el usuario del token
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const userId = req.user.id;
    const benefits = await membershipService.getBenefits(userId);
    return res.status(200).json(benefits);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
