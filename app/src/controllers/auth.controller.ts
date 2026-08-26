import { Request, Response } from 'express';
import authService from '../services/auth.service';
import errorhandler from '../error/errorHandler';

export const getCaptcha = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const captcha = await authService.getCaptcha();
    return res.status(200).json(captcha);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto = req.body;
    const result = await authService.register(dto);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const activateAccount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.body;
    const result = await authService.activateAccount(token);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
