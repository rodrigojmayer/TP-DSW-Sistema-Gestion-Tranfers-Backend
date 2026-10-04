import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '../entities/Usuario.entity.js'; 

// Interfaz para el Payload esperado al verificar el JWT
interface JWTPayload {
  idUsuario: string;
  email: string;
  rol: Rol;
}

export const autenticarToken = (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'Error de configuración: JWT_SECRET no está definido' });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const verificado = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.usuario = verificado; // TypeScript lo reconoce automáticamente por express.d.ts
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const autenticarTokenOpcional = (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'secret';
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continúa como invitado (req.usuario será undefined)
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.usuario = decoded as JWTPayload;
    }
    next();
  });
  
};

export interface RequestConUsuario extends Request {
  usuario?: JWTPayload;
}