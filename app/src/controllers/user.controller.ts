import { Request, Response } from 'express';

import userService from '../services/user.service';
import authService from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import errorhandler from '../error/errorHandler';
import { cookieOptions } from '../config/cookie';
import { UpdateUserDto } from '../dto/update-user.dto';

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateUserDto = req.body;
    const user = await userService.create(dto);

    return res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await userService.findAll();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const authUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await userService.findCredential(email, password);

    return res.status(200).json(user);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const result = await authService.login(email, password, req);

    return res
      .status(201)
      .cookie('accessToken', result.accessToken, cookieOptions)
      .json({
        message: 'Login exitoso',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Usuario sin token' });
    }

    const result = await authService.refresh(refreshToken, req);

    return res
      .status(201)
      .cookie('accessToken', result.accessToken, cookieOptions)
      .json({
        message: 'Token refrescado exitosamente',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
  } catch (error: any) {
    if (error instanceof errorhandler) {
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
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser= async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id){
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const userID: number= req.user.id
    const dto: UpdateUserDto= req.body
    const updatedUser= await userService.updateUser(userID, dto)
    return res
      .status(200)
      .json({
        message: "Usuario actualizado correctamente",
        updatedUser
      })
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};