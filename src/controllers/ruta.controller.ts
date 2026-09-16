import { Request, Response } from 'express';
import { RutaService } from '../services/ruta.service.js';

export class RutaController {
  static async crear(req: Request, res: Response) {
    try {
      const nuevaRuta = await RutaService.crearConPuntos(req.body);
      res.status(201).json(nuevaRuta);
    } catch (error: any) {
      console.error(' Error al crear ruta con puntos:', error);
      res.status(400).json({ error: 'Error al crear la ruta', detalle: error.message });
    }
  }

  static async obtenerTodas(req: Request, res: Response) {
    try {
      const rutas = await RutaService.obtenerTodas();
      res.json(rutas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las rutas del catálogo' });
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        return res.status(400).json({ error: 'ID requerido' });
      }

      const ruta = await RutaService.obtenerRutaConPuntos(id);
      res.json(ruta);
    } catch (error: any) {
      res.status(404).json({ error: 'Ruta no encontrada', detalle: error.message });
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        return res.status(400).json({ error: 'ID requerido' });
      }

      const rutaActualizada = await RutaService.actualizar(id, req.body);
      res.json(rutaActualizada);
    } catch (error: any) {
      res.status(400).json({ error: 'Error al actualizar la ruta', detalle: error.message });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        return res.status(400).json({ error: 'ID requerido' });
      }

      await RutaService.eliminar(id);
      res.json({ message: 'Ruta eliminada correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: 'Error al eliminar la ruta', detalle: error.message });
    }
  }
}