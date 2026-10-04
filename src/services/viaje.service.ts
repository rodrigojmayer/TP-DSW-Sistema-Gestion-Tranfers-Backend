import { getEM } from '../lib/db.js';
import { Viaje, TipoViaje } from '../entities/Viaje.entity.js';
import { Usuario } from '../entities/Usuario.entity.js';
import { Ruta } from '../entities/Ruta.entity.js';
import { Reserva } from '../entities/Reserva.entity.js';

export interface CrearViajeInput {
  tipo: TipoViaje;
  fechaHoraInicio: string | Date;
  fechaHoraFin: string | Date;
  capacidadPasajeros: number;
  capacidadValijas: number;
  precioBase?: number;
  idRuta?: string;
  idChofer?: string | null;
}

export type ActualizarViajeInput = Partial<CrearViajeInput>;

export class ViajeService {
  static async crear(data: CrearViajeInput) {
    const em = getEM().fork();

    const viajeData: any = {
      tipo: data.tipo,
      fechaHoraInicio: new Date(data.fechaHoraInicio),
      fechaHoraFin: new Date(data.fechaHoraFin),
      capacidadPasajeros: data.capacidadPasajeros,
      capacidadValijas: data.capacidadValijas,
      precioBase: data.precioBase,
    };

    if (data.idRuta) {
      viajeData.ruta = data.idRuta;
    }
    
    if (data.idChofer) {
      viajeData.chofer = data.idChofer;
    }

    const nuevoViaje = em.create(Viaje, viajeData);
    em.persist(nuevoViaje);
    await em.flush();

    return await em.findOneOrFail(Viaje, nuevoViaje.id, {
      populate: ['ruta', 'chofer', 'reservas'],
    });
  }

  // 1. PÚBLICO: Obtener únicamente viajes de tipo COMPARTIDO
  static async obtenerPublicos() {
    const em = getEM().fork();
    return await em.find(
      Viaje,
      {
        tipo: TipoViaje.COMPARTIDO,
      },
      {
        populate: ['ruta', 'chofer', 'reservas'],
        orderBy: { fechaHoraInicio: 'asc' },
      }
    );
  }

  // 2. CLIENTE LOGUEADO: Trae los viajes COMPARTIDOS + los viajes donde el cliente tiene reserva
  //////////////////////////////////
  //////////////////////////////////

// ViajeService.ts

static async obtenerParaCliente(usuarioId: string) {
    console.log("=== DEBUG ID CLIENTE RECEBIDO ===", usuarioId); // 👈 Revisa este LOG en la terminal
  const em = getEM().fork();

  // 1. Obtener todos los viajes de tipo COMPARTIDO
  const compartidos = await em.find(
    Viaje,
    { tipo: TipoViaje.COMPARTIDO },
    { 
      populate: ['ruta', 'chofer', 'reservas'],
      orderBy: { fechaHoraInicio: 'asc' } 
    }
  );

  // 2. Obtener las reservas que pertenecen a este usuario
  const reservasDelCliente = await em.find(
    Reserva,
    { usuario: usuarioId as any },
    { populate: ['viaje', 'viaje.ruta', 'viaje.chofer', 'viaje.reservas'] }
  );

  // 3. Fusionar en un Map usando la clave de ID para eliminar duplicados
  const mapViajes = new Map<string, any>();

  // Agregar los compartidos
  for (const viaje of compartidos) {
    mapViajes.set(viaje.id, viaje);
  }

  // Agregar los viajes privados derivados de las reservas del cliente
  for (const reserva of reservasDelCliente) {
    if (reserva.viaje) {
      mapViajes.set(reserva.viaje.id, reserva.viaje);
    }
  }

  // 4. Convertir a Array y ordenar por fecha de inicio
  const resultado = Array.from(mapViajes.values());
  resultado.sort((a, b) => new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime());

  return resultado;
}

///////////////////////
/////////////////////
  // 3. ADMIN / GENERAL: Conservamos tu método original intacto
  static async obtenerTodos() {
    const em = getEM().fork();
    return await em.find(
      Viaje,
      {},
      {
        populate: ['ruta', 'chofer', 'reservas'],
        orderBy: { fechaHoraInicio: 'asc' },
      }
    );
  }

  static async obtenerPorId(id: string) {
    const em = getEM().fork();
    return await em.findOneOrFail(Viaje, { id }, {
      populate: ['ruta', 'chofer', 'reservas', 'reservas.usuario'],
    });
  }

  static async actualizar(id: string, data: ActualizarViajeInput) {
    const em = getEM().fork();
    const viaje = await em.findOneOrFail(Viaje, { id });

    if (data.tipo !== undefined) viaje.tipo = data.tipo;
    if (data.fechaHoraInicio !== undefined) viaje.fechaHoraInicio = new Date(data.fechaHoraInicio);
    if (data.fechaHoraFin !== undefined) viaje.fechaHoraFin = new Date(data.fechaHoraFin);
    if (data.capacidadPasajeros !== undefined) viaje.capacidadPasajeros = Number(data.capacidadPasajeros);
    if (data.capacidadValijas !== undefined) viaje.capacidadValijas = Number(data.capacidadValijas);
    if (data.precioBase !== undefined) viaje.precioBase = Number(data.precioBase);

    if (data.idRuta !== undefined) {
      viaje.ruta = data.idRuta ? em.getReference(Ruta, data.idRuta) : undefined;
    }
    
    if (data.idChofer !== undefined) {
      viaje.chofer = data.idChofer ? em.getReference(Usuario, data.idChofer) : undefined;
    }

    await em.flush();

    return await em.findOneOrFail(Viaje, id, {
      populate: ['ruta', 'chofer', 'reservas'],
    });
  }

  static async eliminar(id: string) {
    const em = getEM().fork();
    const viaje = await em.findOneOrFail(Viaje, { id });
    em.remove(viaje);
    await em.flush();
    return true;
  }
}