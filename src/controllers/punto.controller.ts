import { Request, Response } from 'express';
import { PuntoService } from '../services/punto.service.js';

export class PuntoController {
  static async actualizar(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      // const { nombre, direccion } = req.body;

      if (!id || id === 'undefined') {
        return res.status(400).json({ error: 'El ID del punto es inválido o no fue provisto' });
      }

      const puntoActualizado = await PuntoService.actualizar(id, req.body);
      // const puntoActualizado = await PuntoService.actualizar(id, { nombre, direccion });
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
    try {
      const esArray = Array.isArray(req.body);
      const datosArray = esArray ? req.body : [req.body];

      // Reutilizamos el servicio masivo para guardar todo
      const nuevosPuntos = await PuntoService.crearMasivo(datosArray);

      // Si mandó un objeto solo, devolvemos un objeto solo. Si mandó un array, devolvemos el array.
      if (!esArray) {
        return res.status(201).json(nuevosPuntos[0]);
      }

      res.status(201).json(nuevosPuntos);
    } catch (error: any) {
      res.status(400).json({ error: 'Error al crear el/los punto(s)', detalle: error.message });
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