import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service.js';

export class UsuarioController {
  static async obtenerTodos(req: Request, res: Response) {
    try {
      const usuarios = await UsuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const nuevoUsuario = await UsuarioService.crear(req.body);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear usuario' });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) return res.status(400).json({ error: 'ID requerido' });

      await UsuarioService.eliminar(id);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar usuario' });
    }
  }
}