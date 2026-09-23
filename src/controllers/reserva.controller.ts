import { Request, Response } from 'express';
import { ReservaService } from '../services/reserva.service.js';

export class ReservaController {
  static async crear(req: Request, res: Response) {
    try {
      const idUsuario = req.usuario?.idUsuario;
      if (!idUsuario) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const nuevaReserva = await ReservaService.crear(idUsuario, req.body);
      return res.status(201).json(nuevaReserva);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message || 'Error al crear la reserva' });
    }
  }

  static async obtenerTodas(req: Request, res: Response) {
    try {
      if (req.usuario?.rol === 'ADMIN') {
        const reservas = await ReservaService.obtenerTodas();
        return res.json(reservas);
      } else {
        const idUsuario = req.usuario?.idUsuario;
        if (!idUsuario) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const misReservas = await ReservaService.obtenerPorUsuario(idUsuario);
        return res.json(misReservas);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener reservas' });
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const reserva = await ReservaService.obtenerPorId(id);
      return res.json(reserva);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const reservaActualizada = await ReservaService.actualizar(id, req.body);
      return res.json(reservaActualizada);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message || 'Error al actualizar la reserva' });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await ReservaService.eliminar(id);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
  }
}