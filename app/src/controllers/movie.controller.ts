// app/src/controllers/movie.controller.ts

import { Request, Response } from "express";
import movieService from "../services/movie.service";
import Movie from "../models/movie.model";
import movieRepository from "../repositories/movie.repository";
import errorhandler from "../error/errorHandler";

/**
 * Controlador de Películas
 * -------------------------
 * Maneja las solicitudes HTTP relacionadas con la entidad Movie.
 *
 * Recibe el Request/Response de Express, delega la lógica de negocio
 * al service, y construye la respuesta HTTP correspondiente.
 */


    /**
     * POST /movies
     * Crea una nueva película.
     */
    export const create = async (req: Request, res: Response): Promise<void> => {
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
    export const getCatalog = async (req: Request, res: Response): Promise<void> => {
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
    export const getByName = async (req: Request, res: Response): Promise<void> => {
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
    export const getMovieCinemas = async (req: Request, res: Response): Promise<void> => {
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
                include: [{ association: 'movieCinemas', through: { attributes: [] } }]
            });

            res.status(200).json((cinemas as any)?.['movieCinemas'] || []);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }




    
    export const getWeeklyMovies = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const movies = await movieService.getWeeklyMovies();

    return res.status(200).json(movies);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};





