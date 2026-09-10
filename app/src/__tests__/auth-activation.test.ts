import type { Request, Response } from 'express';
import { activateAccount } from '../controllers/auth.controller';

describe('activación de cuenta', () => {
  it('responde 400 cuando no se envía el token', async () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    await activateAccount({ body: {}, query: {} } as Request, { status } as unknown as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'El token de activación es requerido' });
  });
});
