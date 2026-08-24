import { Request, Response } from 'express';
import { PuntoService } from '../services/punto.service.js';

export class PuntoController {
  static async actualizar(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { nombre, direccion } = req.body;

      const puntoActualizado = await PuntoService.actualizar(id, { nombre, direccion });
      res.status(200).json(puntoActualizado);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error al actualizar el punto' });
    }
  }
  
  static async obtenerTodos(req: Request, res: Response) {
    try {
      const puntos = await PuntoService.obtenerTodos();
      res.json(puntos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los puntos del catálogo' });
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const punto = await PuntoService.obtenerPorId(id);

      if (!punto) {
        return res.status(404).json({ error: 'Punto no encontrado' });
      }

      res.json(punto);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el punto' });
    }
  }

  static async crear(req: Request, res: Response) {
      console.log("req.body: ", req.body) 
    try {
      const { direccion, nombre } = req.body;

      if (!direccion) {
        return res.status(400).json({ error: 'La dirección es obligatoria' });
      }

      const nuevoPunto = await PuntoService.crear({ direccion, nombre });
      res.status(201).json(nuevoPunto);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el punto (puede que la dirección ya exista)' });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await PuntoService.eliminar(id);
      res.json({ message: 'Punto eliminado del catálogo correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'No se puede eliminar el punto si está siendo usado en una ruta' });
    }
  }
}