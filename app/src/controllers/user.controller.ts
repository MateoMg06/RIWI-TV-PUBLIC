import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import userService from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import errorhandler from '../error/errorHandler';
import { createToken, verifyToken } from '../utils/jwt';
import { cookieOptions } from '../config/cookie';

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

export const getOneUsers = async (
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
    const user = await userService.findCredential(email, password);
    const payload = {
      name: user?.name,
      email: user?.email,
      role: user?.role,
    };

    const accessToken = createToken(payload, String(process.env.JWT_SECRET), { expiresIn: '15m' });
    const refreshToken = createToken(payload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: '7d' });

    return res
      .status(201)
      .cookie('accessToken', accessToken, cookieOptions)
      .json({
        message: 'Login exitoso',
        accessToken,
        refreshToken,
        user: {
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
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

    const payload = verifyToken(refreshToken, String(process.env.JWT_REFRESH_SECRET)) as JwtPayload;

    if (!payload) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const newToken = createToken(
      {
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
      String(process.env.JWT_SECRET),
      { expiresIn: '1h' }
    );

    return res
      .status(201)
      .cookie('accessToken', newToken, cookieOptions)
      .json({ newToken });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<Response> => {
  try {
    return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .json({ message: 'Sesión cerrada correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};