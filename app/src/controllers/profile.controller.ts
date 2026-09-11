import type { Request, Response } from 'express';
import ErrorHandler from '../error/errorHandler';
import profileService from '../services/profile.service';

const fail = (res: Response, error: unknown): Response =>
  error instanceof ErrorHandler
    ? res.status(error.estado).json({ error: error.message })
    : res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await profileService.getProfile(req.user!.id));
  } catch (error) {
    return fail(res, error);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await profileService.updateProfile(req.user!.id, req.body));
  } catch (error) {
    return fail(res, error);
  }
};

export const getBenefits = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(await profileService.getBenefits(req.user!.id));
  } catch (error) {
    return fail(res, error);
  }
};
