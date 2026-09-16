import { EntityData } from '@mikro-orm/core';
import { getEM } from '../lib/db.js';
import { Reserva } from '../entities/Reserva.entity.js';
import { TipoViaje } from '../schemas/reserva.schema.js';

export interface CrearReservaInput {
  origen: string;
  destino: string;
  fechaHoraInicio: string | Date;
  fechaHoraFin: string | Date;
  cantPasajeros: number;
  cantValijas: number;
  precio: number;
  tipo: TipoViaje;
  idRuta?: string;
  descuento?: number;
}

export class ReservaService {
  static async crear(idUsuario: string, data: CrearReservaInput) {
    const em = getEM();
    const { tipo, idRuta, descuento, ...baseData } = data;

    const reservaData: any = {
      ...baseData,
      usuario: idUsuario,
      tipo,
    };

    if (tipo === TipoViaje.COMPARTIDO && idRuta) {
      reservaData.compartido = {
        ruta: idRuta,
        descuento: descuento ?? 0,
      };
    }

    if (tipo === TipoViaje.PRIVADO) {
      reservaData.privado = {};
    }

    const nuevaReserva = em.create(Reserva, reservaData as any);

    em.persist(nuevaReserva);
    await em.flush();

    // ✅ Usamos 'any' en el populate para evitar conflictos de tipos en notación de puntos anidados
    return await em.findOneOrFail(Reserva, nuevaReserva.id, {
      populate: ['usuario', 'compartido', 'privado'] as any,
    });
  }

  static async obtenerTodas() {
    const em = getEM();
    return await em.find(
      Reserva,
      {},
      {
        populate: ['usuario', 'compartido', 'privado'] as any,
        orderBy: { createdAt: 'desc' },
      }
    );
  }

  static async obtenerPorUsuario(idUsuario: string) {
    const em = getEM();
    return await em.find(
      Reserva,
      { usuario: idUsuario },
      {
        populate: ['compartido', 'privado'] as any,
        orderBy: { createdAt: 'desc' },
      }
    );
  }
}