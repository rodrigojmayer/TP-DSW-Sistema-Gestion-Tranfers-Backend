import { Response, NextFunction } from 'express';
import { RequestConUsuario } from './auth.middleware.js';

export const requerirRol = (...rolesPermitidos: string[]) => {
  return (req: RequestConUsuario, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const rolUsuario = req.usuario.rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ 
        error: `Acceso denegado: Se requiere alguno de los siguientes roles [${rolesPermitidos.join(', ')}]` 
      });
    }

    next();
  };
};