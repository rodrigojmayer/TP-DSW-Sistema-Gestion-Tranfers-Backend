import { Request, Response } from 'express';
import { ReservaService } from '../services/reserva.service.js';
import { UsuarioService } from '../services/usuario.service.js';

export class ReservaController {
  static async crear(req: Request, res: Response) {
    try {
      // Si viene autenticado toma su ID, si es invitado usa un ID/usuario por defecto o null
      let idUsuario = req.usuario?.idUsuario;

      if (!idUsuario) {
        const { pasajeroNombre, pasajeroApellido, pasajeroDni, pasajeroEmail, pasajeroTelefono } = req.body;

        if (!pasajeroEmail || !pasajeroDni) {
          return res.status(400).json({
            error: 'El Email y DNI son requeridos para procesar la reserva express',
          });
        }

        // Buscar por Email/DNI o crear usuario invitado sin contraseña
        const usuarioInvitado = await UsuarioService.obtenerOCrearInvitado({
          nombre: pasajeroNombre,
          apellido: pasajeroApellido,
          dni: pasajeroDni,
          email: pasajeroEmail,
          telefono: pasajeroTelefono,
        });

        idUsuario = usuarioInvitado.id;
      }

      const nuevaReserva = await ReservaService.crear(idUsuario, req.body);
      return res.status(201).json(nuevaReserva);
    } catch (error: unknown) {
      console.error(error);
      const errMessage = error instanceof Error ? error.message : 'Error al crear la reserva';
      return res.status(400).json({ error: errMessage });
    }
  }

  static async crearReservaPrivada(req: Request, res: Response) {
    try {
      let idUsuario = req.usuario?.idUsuario;

      // Si el usuario no está autenticado, procesamos los datos del invitado
      if (!idUsuario) {
        const { pasajeroNombre, pasajeroApellido, pasajeroDni, pasajeroEmail, pasajeroTelefono } = req.body;

        if (!pasajeroEmail || !pasajeroDni) {
          return res.status(400).json({
            error: 'El Email y DNI son requeridos para procesar la reserva privada',
          });
        }

        const usuarioInvitado = await UsuarioService.obtenerOCrearInvitado({
          nombre: pasajeroNombre,
          apellido: pasajeroApellido,
          dni: pasajeroDni,
          email: pasajeroEmail,
          telefono: pasajeroTelefono,
        });

        idUsuario = usuarioInvitado.id;
      }

      // Invocamos el servicio pasando el idUsuario y el resto del body
      const nuevaReserva = await ReservaService.crearReservaPrivada({
        idUsuario,
        ...req.body,
      });

      return res.status(201).json(nuevaReserva);
    } catch (error: unknown) {
      console.error(error);
      const errMessage = error instanceof Error ? error.message : 'Error al crear la reserva privada';
      return res.status(400).json({ error: errMessage });
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

  static async obtenerPorCliente(req: Request, res: Response) {
    try {
      const idCliente = String(req.params.idCliente);
      const reservas = await ReservaService.obtenerPorUsuario(idCliente);
      return res.json(reservas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener las reservas del cliente' });
    }
  }

  static async obtenerPorViaje(req: Request, res: Response) {
    try {
      const idViaje = String(req.params.idViaje);
      const reservas = await ReservaService.obtenerPorViaje(idViaje);
      return res.json(reservas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener las reservas del viaje' });
    }
  }

  static async obtenerOcupacionPublica(req: Request, res: Response) {
    try {
      const idViaje = String(req.params.idViaje);
      const reservas = await ReservaService.obtenerPorViaje(idViaje);

      // Mapeamos únicamente las propiedades necesarias para el cálculo visual en el frontend
      const ocupacionAnonima = reservas.map((r: any) => ({
        id: r.id,
        origen: r.origen,
        destino: r.destino,
        cantPasajeros: r.cantPasajeros || r.asiento || 1,
        cantValijas: r.cantValijas || 0,
      }));

      return res.json(ocupacionAnonima);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener la ocupación del viaje' });
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
      return res.status(200).json({ mensaje: 'Reserva eliminada con éxito', id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
  }
}