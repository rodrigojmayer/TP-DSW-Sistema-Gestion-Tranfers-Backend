import { Rol } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        idUsuario: string;
        email: string;
        rol: Rol;
      };
    }
  }
}
