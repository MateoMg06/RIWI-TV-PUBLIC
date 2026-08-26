// app/src/controllers/movie.controller.ts

import { Request, Response } from "express";
import movieService from "../services/movie.service";
import Movie from "../models/movie.model";
import movieRepository from "../repositories/movie.repository";

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
     * Obtiene la cartelera. Si recibe ?cityId filtra por ciudad activa.
     */
    async getCatalog(req: Request, res: Response): Promise<void> {
        try {
            const rawCityId = req.query.cityId as string | undefined;
            if (rawCityId !== undefined) {
                const cityId = parseInt(rawCityId as string, 10);
                if (isNaN(cityId) || cityId <= 0) {
                    res.status(400).json({ error: 'cityId debe ser un número entero positivo' });
                    return;
                }
                const result = await movieService.getCatalogByCity(cityId);
                // Always return structured response for filtered catalog
                res.status(200).json(result);
                return;
            }
            const catalog = await movieService.getCatalog();
            res.status(200).json(catalog);
        } catch (error: any) {
            if (error && error.estado) {
                res.status(error.estado).json({ error: error.message });
                return;
            }
            res.status(500).json({
                message: "Error al obtener la cartelera",
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    /**
     * GET /movies/catalog/:cityId - alias explícito para cartelera por ciudad
     */
    async getCatalogByCity(req: Request, res: Response): Promise<void> {
        try {
            const cityId = parseInt(req.params.cityId as string, 10);
            if (isNaN(cityId) || cityId <= 0) {
                res.status(400).json({ error: 'cityId debe ser un número entero positivo' });
                return;
            }
            const result = await movieService.getCatalogByCity(cityId);
            if (result.data.length === 0) {
                res.status(200).json({ city: result.city, data: [], message: result.message });
                return;
            }
            res.status(200).json(result);
        } catch (error: any) {
            if (error && error.estado) {
                res.status(error.estado).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: error.message ?? 'Error desconocido' });
        }
    }

    /**
     * GET /movies/:name
     * Obtiene una película por nombre.
     */
    async getByName(req: Request, res: Response): Promise<void> {
        try {
            const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
            const movie = await movieService.getByName(name);
            res.status(200).json(movie);
        } catch (error) {
            res.status(404).json({
                message: error instanceof Error ? error.message : "Película no encontrada",
            });
        }
    }

    /**
     * GET /movies/:id/cinemas
     * Obtiene los cines donde se proyecta una película.
     */
    async getMovieCinemas(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const movieId = parseInt(id as string, 10);

            if (isNaN(movieId) || movieId <= 0) {
                res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
                return;
            }

            // Validar que la película existe
            const movie = await movieRepository.findByPk(movieId);
            if (!movie) {
                res.status(404).json({ error: 'Película no encontrada' });
                return;
            }

            const cinemas = await Movie.findByPk(movieId, {
                include: [{ association: 'cinemas', through: { attributes: [] } }]
            });

            res.status(200).json((cinemas as any)?.['cinemas'] || []);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }
}

export default new MovieController();
