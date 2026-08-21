// app/src/controllers/membership.controller.ts

import { Request, Response } from "express";
import membershipService from "../services/membership.service";
import Membership from "../models/membership.model";
import MembershipRepository from "../repositories/membership.repository";
;

/**
 * Controlador de Membresías
 * -------------------------
 * Maneja las solicitudes HTTP relacionadas con la entidad Membership.
 *
 * Recibe el Request/Response de Express, delega la lógica de negocio
 * al service, y construye la respuesta HTTP correspondiente.
 */
class MembershipController {

    /**
     * POST /memberships
     * Crea una nueva membresía.
     */
    async create(req: Request, res: Response): Promise<void> {
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
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const memberships = await membershipService.getCatalog();
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
    async getByUserName(req: Request, res: Response): Promise<void> {
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

    /**
     * GET /memberships/:id/cinemas
     * Obtiene los cines donde se proyecta una membresía.
     */
    
}


export default new MembershipController();