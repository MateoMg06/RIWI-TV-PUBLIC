import { JwtPayload } from 'jsonwebtoken';

type RolePayload = JwtPayload & {
  id?: number;
  email?: string;
  name?: string;
  membership?: string;
  role?: string;
  cityId?: number | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: RolePayload | string;
    }
  }
}

export {};

