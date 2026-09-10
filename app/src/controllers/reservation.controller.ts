import type { Request, Response } from 'express';
import ErrorHandler from '../error/errorHandler';
import reservationService from '../services/reservation.service';

const positive = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new ErrorHandler(400, 'ID inválido');
  return parsed;
};
const fail = (res: Response, error: unknown): Response =>
  error instanceof ErrorHandler
    ? res.status(error.estado).json({ error: error.message })
    : res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });

export const getSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await reservationService.getSeats(positive(req.params.id)));
  } catch (error) {
    return fail(res, error);
  }
};

export const lockSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Usuario no autenticado' });
    if (!Array.isArray(req.body.seatIds))
      throw new ErrorHandler(400, 'seatIds debe ser un arreglo');
    const seatIds = req.body.seatIds.map(positive);
    return res
      .status(201)
      .json(
        await reservationService.lockSeats(
          req.user.id,
          positive(req.body.showtimeId),
          seatIds,
          req.body.acceptsAccessiblePolicy === true,
        ),
      );
  } catch (error) {
    return fail(res, error);
  }
};

export const releaseSeats = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Usuario no autenticado' });
    const seatIds = Array.isArray(req.body?.seatIds) ? req.body.seatIds.map(positive) : undefined;
    return res.status(200).json(await reservationService.releaseSeats(req.user.id, seatIds));
  } catch (error) {
    return fail(res, error);
  }
};

export const getReservationSummary = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await reservationService.getSummary(req.user!.id));
  } catch (error) {
    return fail(res, error);
  }
};
