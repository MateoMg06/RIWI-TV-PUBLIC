import { timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

export function requireSeedKey(req: Request, res: Response, next: NextFunction): void {
  const configuredKey = process.env.SEED_API_KEY?.trim();

  if (!configuredKey) {
    res.status(503).json({ error: 'El endpoint del seeder no está configurado' });
    return;
  }

  const providedKey = req.header('x-seed-key')?.trim();
  const configuredBuffer = Buffer.from(configuredKey);
  const providedBuffer = Buffer.from(providedKey ?? '');
  const authorized =
    configuredBuffer.length === providedBuffer.length &&
    timingSafeEqual(configuredBuffer, providedBuffer);

  if (!authorized) {
    res.status(401).json({ error: 'Clave del seeder inválida' });
    return;
  }

  next();
}
