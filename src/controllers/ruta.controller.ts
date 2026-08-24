import { Request, Response } from 'express';
import { RutaService } from '../services/ruta.service.js';

export class RutaController {
  static async actualizar(req: Request, res: Response) {
    try {
      const id  = req.params.id as string;
      const { nombre, puntos } = req.body;

      const rutaActualizada = await RutaService.actualizar(id, { nombre, puntos });
      res.status(200).json(rutaActualizada);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error al actualizar la ruta' });
    }
  }
  
  static async obtenerTodas(req: Request, res: Response) {
    try {
      const rutas = await RutaService.obtenerTodas();
      res.json(rutas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las rutas' });
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const ruta = await RutaService.obtenerPorId(id);

      if (!ruta) {
        return res.status(404).json({ error: 'Ruta no encontrada' });
      }

      res.json(ruta);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la ruta' });
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const { nombre, puntos } = req.body;

      if (!nombre || !puntos || !Array.isArray(puntos) || puntos.length < 2) {
        return res.status(400).json({
          error: 'Debe ingresar un nombre y al menos 2 puntos del catálogo para definir la ruta',
        });
      }

      const nuevaRuta = await RutaService.crear({ nombre, puntos });
      res.status(201).json(nuevaRuta);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la ruta. Verifique los IDs de los puntos.' });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await RutaService.eliminar(id);
      res.json({ message: 'Ruta eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar la ruta' });
    }
  }
}