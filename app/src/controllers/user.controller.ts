import { Request, Response } from 'express';

import userService from '../services/user.service';
import { AuthPayload } from '../types/index.d';
import { CreateUserDto } from '../dto/create-user.dto';
import errorhandler from '../error/errorHandler';
import { createToken, verifyToken } from '../utils/jwt';
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
    const user = await userService.findOne(email);

    if (!user) {
      return res.status(401).json({error: 'Credenciales inválidas'});
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()){
      return res.status(401).json({error: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos, inténtelo nuevamente en unos minutos'});
    }

    const validatedUser = await userService.findCredential(email, password);
    if (!validatedUser) {
      return res.status(401).json({error: 'Credenciales inválidas'})
    }

    await userService.clearAttempts(validatedUser)
    
    const payload = {
      role: user?.role,
      id: user?.id,
      name: user?.name,
      membership: user?.membership
    };

    const accessToken = createToken(payload, String(process.env.JWT_SECRET), { expiresIn: '15m'});
    const refreshToken = createToken(payload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: '7d' });

    return res
      .status(201)
      .cookie('accessToken', accessToken, cookieOptions)
      .json({
        message: 'Login exitoso',
        accessToken,
        refreshToken,
        user: {
          role: payload.role,
          id: payload.id,
          name: payload.name,
          membership: payload.membership
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

    const payload = verifyToken(refreshToken, String(process.env.JWT_REFRESH_SECRET)) as AuthPayload;

    if (!payload) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const newToken = createToken(
      {
        role: payload.role,
        id: payload.id,
        name: payload.name,
        membership: payload.membership
      },
      String(process.env.JWT_SECRET),
      { expiresIn: '15m' }
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