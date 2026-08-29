import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Extendemos la interfaz Request de Express para guardar los datos del usuario autenticado
export interface RequestConUsuario extends Request {
  usuario?: {
    idUsuario: string;
    rol: string;
  };
}

export const autenticarToken = (req: RequestConUsuario, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // El token viene habitualmente con el formato: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const verificado = jwt.verify(token, JWT_SECRET) as { idUsuario: string; rol: string };
    req.usuario = verificado; // Guardamos la info del token en la petición
    next(); // Continuamos a la siguiente función/controlador
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};