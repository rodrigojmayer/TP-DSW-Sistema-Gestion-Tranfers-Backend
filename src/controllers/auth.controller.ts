import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { identificador, password } = req.body; // 'identificador' puede ser email o usuario

      if (!identificador || !password) {
        return res.status(400).json({ error: 'Faltan credenciales requeridas' });
      }

      const resultado = await AuthService.login(identificador, password);
      
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Error de autenticación' });
    }
  }
}