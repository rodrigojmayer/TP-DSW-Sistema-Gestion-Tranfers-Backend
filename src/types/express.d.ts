import { Rol } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        idUsuario: string;
        email: string;
        rol: Rol;
      };
    }
  }
}
