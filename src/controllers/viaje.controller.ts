// src/controllers/viaje.controller.ts
import { Request, Response } from 'express';
import { ViajeService } from '../services/viaje.service.js';

export class ViajeController {
  static async crear(req: Request, res: Response) {
    try {
      const nuevoViaje = await ViajeService.crear(req.body);
      return res.status(201).json(nuevoViaje);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message || 'Error al crear el viaje' });
    }
  }

  // 1. PÚBLICO: Invitados y Buscador
  static async obtenerPublicos(req: Request, res: Response) {
    try {
      const viajes = await ViajeService.obtenerPublicos();
      return res.json(viajes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener viajes públicos' });
    }
  }

  // 2. CLIENTE LOGUEADO: Sus reservas + viajes compartidos
static async obtenerParaCliente(req: Request, res: Response) {
  try {
    // TypeScript reconoce idUsuario. Usamos (req.usuario as any)?.id como salvaguarda en JS
    const usuarioId = req.usuario?.idUsuario || (req.usuario as any)?.id;

    console.log('req.usuario completo en controller:', req.usuario);

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado o ID no encontrado en el token' });
    }

    const viajes = await ViajeService.obtenerParaCliente(usuarioId);
    return res.json(viajes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener viajes del cliente' });
  }
}

  // 3. ADMIN / GENERAL: Conservamos tu método original para administradores
  static async obtenerTodos(req: Request, res: Response) {
    try {
      const viajes = await ViajeService.obtenerTodos();
      return res.json(viajes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener viajes' });
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const viaje = await ViajeService.obtenerPorId(id);
      return res.json(viaje);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const viajeActualizado = await ViajeService.actualizar(id, req.body);
      return res.json(viajeActualizado);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message || 'Error al actualizar el viaje' });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await ViajeService.eliminar(id);
      return res.status(200).json({ mensaje: 'Viaje eliminado con éxito', id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar el viaje' });
    }
  }
}