import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import userService from '../services/user.service';
import movieService from '../services/movie.service';
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
      id: user?.id,
      email: user?.email,
      name: user?.name,
      membership: user?.membership,
      role: user?.role,
      cityId: (user as any)?.cityId ?? null,
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

    const payload = verifyToken(refreshToken, String(process.env.JWT_REFRESH_SECRET)) as JwtPayload;

    if (!payload) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const newToken = createToken(
      {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        membership: payload.membership,
        role: payload.role,
        cityId: payload.cityId,
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
    const id = Number(req.params.id)
    const dto: UpdateUserDto = req.body;
    const updatedUser= await userService.updateUser(id, dto)
    return res
      .status(200)
      .json({
        message: "Usuario actualizado correctamente",
        updatedUser
      })
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const setLocation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userPayload: any = (req as any).user;
    // JWT payload may contain id or userId or name; try to resolve
    let userId: number | null = null;
    if (userPayload) {
      if (typeof userPayload === 'string') {
        // ignore
      } else {
        userId = userPayload.id ?? userPayload.userId ?? userPayload.sub ?? null;
      }
    }
    // Fallback: if route provides :id param (not used) or body userId (for tests without JWT)
    if (!userId) {
      if (req.params.id) userId = Number(req.params.id);
      else if ((req.body as any).userId) userId = Number((req.body as any).userId);
    }
    // If still no userId, try to find by email in token payload (membership/name only case)
    // For compatibility with current login payload (only name,membership), require userId in body or derive from cookie lookup
    // If no JWT id, we attempt to read from request: if authToken verified, we can still use raw token id via req.user
    // As last resort, if request is authenticated but payload lacks id, fail with 401
    if (!userId || isNaN(userId)) {
      // Attempt to extract from header cookie alternative: look for user identification via email payload
      return res.status(401).json({ error: 'Usuario no autenticado o token sin identificación' });
    }

    const { cityId } = req.body as any;
    if (cityId === undefined || cityId === null) {
      return res.status(400).json({ error: 'cityId es requerido' });
    }
    const parsedCityId = Number(cityId);
    if (isNaN(parsedCityId) || parsedCityId <= 0) {
      return res.status(400).json({ error: 'cityId debe ser un número entero positivo' });
    }

    const updatedUser = await userService.setLocation(userId, parsedCityId);
    const catalog = await movieService.getCatalogByCity(parsedCityId);

    return res.status(200).json({
      message: 'Ubicación actualizada correctamente',
      user: updatedUser,
      catalog,
    });
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};