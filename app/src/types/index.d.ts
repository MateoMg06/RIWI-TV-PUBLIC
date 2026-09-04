import { JwtPayload } from 'jsonwebtoken';

type RolePayload = JwtPayload & {
  id?: number;
  role?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: RolePayload | string;
    }
  }
}

export {};

