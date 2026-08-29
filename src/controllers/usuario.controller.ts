import { Request, Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware.js';
import { UsuarioService } from '../services/usuario.service.js';

export class UsuarioController {
    static async actualizar(req: Request, res: Response) {
      try {
        const id = req.params.id as string;
        const { nombre, email, password } = req.body;

        const usuarioActualizado = await UsuarioService.actualizar(id, { nombre, email, password });
        
        res.status(200).json(usuarioActualizado);
      } catch (error) {
        console.error(error);
        res.status(400).json({ 
          error: 'Error al actualizar el usuario (verificá que el ID exista o que el email no esté duplicado)' 
        });
      }
    }
    
    static async actualizarMiPerfil(req: RequestConUsuario, res: Response) {
      try {
        const idUsuario = req.usuario?.idUsuario;
        if (!idUsuario) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        // Actualizas usando tu servicio de actualización existente pasándole el idUsuario del token
        const usuarioActualizado = await UsuarioService.actualizar(idUsuario, req.body);
        return res.json(usuarioActualizado);
      } catch (error: any) {
        return res.status(400).json({ error: error.message || 'Error al actualizar el perfil' });
      }
    }

    static async obtenerPorId(req: Request, res: Response) {
      try {
        const id = req.params.id as string;
        const usuario = await UsuarioService.obtenerPorId(id);

        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al buscar el usuario' });
      }
    }
    static async obtenerMiPerfil(req: RequestConUsuario, res: Response) {
      try {
        // Tomamos el idUsuario que guardó el middleware autenticarToken
        const idUsuario = req.usuario?.idUsuario;

        if (!idUsuario) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        // 💥 Reutilizamos tu servicio exacto
        const usuario = await UsuarioService.obtenerPorId(idUsuario);

        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(usuario);
      } catch (error: any) {
        return res.status(500).json({ error: 'Error al obtener el perfil' });
      }
    }

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