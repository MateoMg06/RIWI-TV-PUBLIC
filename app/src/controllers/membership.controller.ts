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

   

