import { getEM } from '../lib/db.js';
import { Reserva } from '../entities/Reserva.entity.js';
import { Viaje, TipoViaje } from '../entities/Viaje.entity.js';

export interface CrearReservaInput {
  idViaje: string;
  origen: string;
  destino: string;
  cantPasajeros: number;
  cantValijas: number;
  precio: number;
  pagoAbonado?: boolean;
  habilitado?: boolean;
}

export type ActualizarReservaInput = Partial<CrearReservaInput>;

export class ReservaService {
  static async crear(idUsuario: string, data: CrearReservaInput) {
    const em = getEM().fork();

    // 1. Buscar el viaje con sus reservas asociadas
    const viaje = await em.findOneOrFail(
      Viaje,
      { id: data.idViaje },
      { populate: ['reservas'] }
    );

    // 2. Validar restricciones si el viaje es PRIVADO
    if (viaje.tipo === TipoViaje.PRIVADO && viaje.reservas.length > 0) {
      throw new Error('Este viaje privado ya cuenta con una reserva asignada');
    }




    // 5. Instanciar y guardar la nueva reserva
    const nuevaReserva = em.create(Reserva, {
      usuario: idUsuario as any,
      viaje: viaje,
      origen: data.origen,
      destino: data.destino,
      cantPasajeros: data.cantPasajeros,
      cantValijas: data.cantValijas,
      precio: data.precio,
      pagoAbonado: data.pagoAbonado ?? false,
      habilitado: data.habilitado ?? true,
    });

    em.persist(nuevaReserva);
    await em.flush();

    return await em.findOneOrFail(Reserva, nuevaReserva.id, {
      populate: ['usuario', 'viaje'],
    });
  }

  static async obtenerTodas() {
    const em = getEM().fork();
    return await em.find(
      Reserva,
      {},
      {
        populate: ['usuario', 'viaje'],
        orderBy: { createdAt: 'desc' },
      }
    );
  }

  static async obtenerPorUsuario(idUsuario: string) {
    const em = getEM().fork();
    return await em.find(
      Reserva,
      { usuario: idUsuario },
      {
        populate: ['viaje'],
        orderBy: { createdAt: 'desc' },
      }
    );
  }

  static async obtenerPorId(id: string) {
    const em = getEM().fork();
    return await em.findOneOrFail(Reserva, { id }, {
      populate: ['usuario', 'viaje'],
    });
  }

  static async actualizar(id: string, data: ActualizarReservaInput) {
    const em = getEM().fork();
    const reserva = await em.findOneOrFail(Reserva, { id });

    if (data.origen !== undefined) reserva.origen = data.origen;
    if (data.destino !== undefined) reserva.destino = data.destino;
    if (data.cantPasajeros !== undefined) reserva.cantPasajeros = data.cantPasajeros;
    if (data.cantValijas !== undefined) reserva.cantValijas = data.cantValijas;
    if (data.precio !== undefined) reserva.precio = data.precio;
    if (data.pagoAbonado !== undefined) reserva.pagoAbonado = data.pagoAbonado;
    if (data.habilitado !== undefined) reserva.habilitado = data.habilitado;

    await em.flush();

    return await em.findOneOrFail(Reserva, id, {
      populate: ['usuario', 'viaje'],
    });
  }

  static async eliminar(id: string) {
    const em = getEM().fork();
    const reserva = await em.findOneOrFail(Reserva, { id }, { populate: ['viaje'] });

    em.remove(reserva);
    await em.flush();

    return true;
  }
}