import type { NextFunction, Request, Response } from 'express';

/** Reject missing or malformed JSON before controllers read DTO properties. */
export function validateJsonBody(req: Request, res: Response, next: NextFunction): void {
  if (
    !['POST', 'PUT', 'PATCH'].includes(req.method) ||
    req.path === '/logout' ||
    (['/activate', '/verify-email'].includes(req.path) && typeof req.query.token === 'string')
  ) {
    next();
    return;
  }
  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    res.status(400).json({ error: 'Debes enviar un objeto JSON con los campos requeridos' });
    return;
  }
  next();
}
