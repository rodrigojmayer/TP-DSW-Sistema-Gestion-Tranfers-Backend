import { Response, NextFunction } from 'express';
import { Rol } from '@prisma/client';
import { RequestConUsuario } from './auth.middleware.js';

export const requerirRol = (...rolesPermitidos: Rol[]) => {
  return (req: RequestConUsuario, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Convertimos el string a tipo Rol para validar contra los permitidos
    const rolUsuario = req.usuario.rol as Rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ 
        error: `Acceso denegado: Se requiere alguno de los siguientes roles [${rolesPermitidos.join(', ')}]` 
      });
    }

    next();
  };
};