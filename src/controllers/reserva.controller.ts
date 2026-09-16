import { Request, Response } from 'express';
import { ReservaService } from '../services/reserva.service.js';

export class ReservaController {
  static async crear(req: Request, res: Response) {
    try {
      const idUsuario = req.user?.idUsuario;
      if (!idUsuario) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const nuevaReserva = await ReservaService.crear(idUsuario, req.body);
      return res.status(201).json(nuevaReserva);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al crear la reserva' });
    }
  }

  static async obtenerTodas(req: Request, res: Response) {
    try {
      if (req.user?.rol === 'ADMIN') {
        const reservas = await ReservaService.obtenerTodas();
        return res.json(reservas);
      } else {
        const idUsuario = req.user?.idUsuario;
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
}