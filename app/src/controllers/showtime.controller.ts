import type { Request, Response } from 'express';
import ErrorHandler from '../error/errorHandler';
import showtimeService from '../services/showtime.service';

const id = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new ErrorHandler(400, 'ID inválido');
  return parsed;
};
const fail = (res: Response, error: unknown): Response =>
  error instanceof ErrorHandler
    ? res.status(error.estado).json({ error: error.message })
    : res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });

export const getShowtime = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await showtimeService.getAvailable(id(req.params.id)));
  } catch (error) {
    return fail(res, error);
  }
};
export const getShowtimePrices = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await showtimeService.getPrices(id(req.params.id)));
  } catch (error) {
    return fail(res, error);
  }
};
