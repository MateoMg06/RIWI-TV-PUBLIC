import { Request, Response } from 'express';

import userService from '../services/user.service';
import authService from '../services/auth.service';
import { register } from './auth.controller';
import ErrorHandler from '../error/errorHandler';
import { cookieOptions } from '../config/cookie';
import { UpdateUserDto } from '../dto/update-user.dto';

const sanitizeUser = (user: any) => {
  const safe = { ...(typeof user?.get === 'function' ? user.get({ plain: true }) : user) };
  for (const field of [
    'password',
    'activationToken',
    'accessToken',
    'refreshToken',
    'resetToken',
    'resetTokenExpires',
  ]) {
    delete safe[field];
  }
  return safe;
};

// All public registration aliases enforce the same CAPTCHA and activation flow.
export const createUser = register;

export const getUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await userService.findAll();
    // Excluir campos sensibles de la respuesta
    const safeUsers = users.map(sanitizeUser);
    return res.status(200).json(safeUsers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const authUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body ?? {};
    const user = await userService.findCredential(email, password);

    // Excluir campos sensibles de la respuesta
    return res.status(200).json(sanitizeUser(user));
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const result = await authService.login(email, password, req);

    return res.status(201).cookie('accessToken', result.accessToken, cookieOptions).json({
      message: 'Login exitoso',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body ?? {};

    if (typeof refreshToken !== 'string' || !refreshToken) {
      return res.status(401).json({ error: 'Usuario sin token' });
    }

    const result = await authService.refresh(refreshToken, req);

    return res.status(201).cookie('accessToken', result.accessToken, cookieOptions).json({
      message: 'Token refrescado exitosamente',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || null;

    await authService.logout(userId, req);

    return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .json({ message: 'Sesión cerrada correctamente' });
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const userID = Number(req.params.id);
    if (!Number.isInteger(userID) || userID <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    if (userID !== req.user.id) {
      return res.status(403).json({ error: 'Solo puedes actualizar tu propio usuario' });
    }
    const dto: UpdateUserDto = req.body;
    const updatedUser = await userService.updateUser(userID, dto);
    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      updatedUser: sanitizeUser(updatedUser),
    });
  } catch (error: any) {
    if (error instanceof ErrorHandler)
      return res.status(error.estado).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const setLocation = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Usuario no autenticado' });
    const cityId = Number(req.body.cityId);
    if (!Number.isInteger(cityId) || cityId <= 0)
      return res.status(400).json({ error: 'cityId debe ser un entero positivo' });
    return res.status(200).json({
      message: 'Ubicación actualizada correctamente',
      user: sanitizeUser(await userService.setLocation(req.user.id, cityId)),
    });
  } catch (error) {
    if (error instanceof ErrorHandler)
      return res.status(error.estado).json({ error: error.message });
    return res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Error interno' });
  }
};
