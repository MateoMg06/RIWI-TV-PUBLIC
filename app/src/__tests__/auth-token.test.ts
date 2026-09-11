import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authToken } from '../middlewares/authToken';
import userRepository from '../repositories/user.repository';

describe('authToken HU-007', () => {
  const secret = 'test-access-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  afterEach(() => jest.restoreAllMocks());

  it('acepta Bearer y valida que la sesión siga activa en base de datos', async () => {
    const token = jwt.sign({ id: 4, role: 'usuario', name: 'Ada', membership: 'básica' }, secret);
    jest.spyOn(userRepository, 'findByID').mockResolvedValue({
      accountStatus: 'active',
      accessToken: token,
    } as any);
    const next = jest.fn() as NextFunction;
    const request = { headers: { authorization: `Bearer ${token}` }, cookies: {} } as Request;
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await authToken(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(request.user?.id).toBe(4);
  });

  it('rechaza un JWT correcto que fue invalidado por otro login o logout', async () => {
    const token = jwt.sign({ id: 4, role: 'usuario', name: 'Ada', membership: 'básica' }, secret);
    jest.spyOn(userRepository, 'findByID').mockResolvedValue({
      accountStatus: 'active',
      accessToken: 'otro-token',
    } as any);
    const next = jest.fn() as NextFunction;
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    await authToken(
      { headers: { authorization: `Bearer ${token}` }, cookies: {} } as Request,
      { status, json } as unknown as Response,
      next,
    );

    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
