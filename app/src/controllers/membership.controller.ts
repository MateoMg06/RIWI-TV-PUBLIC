import { Request, Response } from 'express';
import membershipService from '../services/membership.service';
import { CreateMembershipDto } from '../dto/create-membership.dto';
import ErrorHandler from '../error/errorHandler';

export const createMembership = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const dto: CreateMembershipDto = {
      ...req.body,
      userId: req.user.id,
    };
    const result = await membershipService.createMembership(dto);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getMembership = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const membership = await membershipService.getMembershipByUserId(req.user.id);
    return res.status(200).json(membership);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getPurchaseHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const history = await membershipService.getPurchaseHistory(req.user.id);
    return res.status(200).json(history);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
