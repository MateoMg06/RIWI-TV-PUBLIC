// app/src/controllers/movie.controller.ts

import { Request, Response } from "express";
import movieService from "../services/movie.service";

/**
 * Controlador de Películas
 * -------------------------
 * Maneja las solicitudes HTTP relacionadas con la entidad Movie.
 *
 * Recibe el Request/Response de Express, delega la lógica de negocio
 * al service, y construye la respuesta HTTP correspondiente.
 */
class MovieController {

    /**
     * POST /movies
     * Crea una nueva película.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const movie = await movieService.create(req.body);
            res.status(201).json(movie);
        } catch (error) {
            res.status(500).json({
                message: "Error al crear la película",
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    /**
     * GET /movies
     * Obtiene la cartelera completa de películas.
     */
    async getCatalog(req: Request, res: Response): Promise<void> {
        try {
            const catalog = await movieService.getCatalog();
            res.status(200).json(catalog);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener la cartelera",
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    /**
     * GET /movies/:name
     * Obtiene una película por nombre.
     */
    async getByName(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.params;
            const movie = await movieService.getByName(name);
            res.status(200).json(movie);
        } catch (error) {
            res.status(404).json({
                message: error instanceof Error ? error.message : "Película no encontrada",
            });
        }
    }
}

export default new MovieController();