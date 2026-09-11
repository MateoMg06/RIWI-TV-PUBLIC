import type { Request, Response } from 'express';
import { positiveInt, sendError } from './movie.controller';
import movieService from '../services/movie.service';

export const requestUpcomingNotification = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const user = req.user;
    const userId = user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });
    const movieId = positiveInt(req.body.movieId);
    if (!movieId) return res.status(400).json({ error: 'movieId es requerido' });
    const location = req.body.cityId ?? user.cityId;
    const cityId = location == null ? undefined : positiveInt(location);
    return res
      .status(201)
      .json(await movieService.requestUpcomingNotification(userId, movieId!, cityId));
  } catch (error) {
    return sendError(res, error);
  }
};
