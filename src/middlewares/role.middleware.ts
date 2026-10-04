import { Request, Response, NextFunction } from 'express';

export const requerirRol = (rolesPermitidos: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rolUsuario = req.usuario?.rol;

    if (!rolUsuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Normalizar a un arreglo
    const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

    if (!roles.includes(rolUsuario)) {
      return res.status(403).json({ error: 'No tienes permisos suficientes para realizar esta acción' });
    }

    next();
  };
};