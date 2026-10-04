import { getEM } from '../lib/db.js';
import { Reserva, EstadoReserva } from '../entities/Reserva.entity.js';
import { Viaje, TipoViaje, EstadoViaje } from '../entities/Viaje.entity.js';
import { Punto } from '../entities/Punto.entity.js';
import { Ruta } from '../entities/Ruta.entity.js';
import { Usuario } from '../entities/Usuario.entity.js';

export interface CrearReservaInput {
  idViaje: string;
  origen: string;
  destino: string;
  cantPasajeros: number;
  cantValijas: number;
  precio: number;
  estado?: EstadoReserva;
  pagoAbonado?: boolean;
  habilitado?: boolean;
}

export interface CrearReservaPrivadaInput {
  idUsuario: string;
  origen: {
    nombre: string;
    latitud: number;
    longitud: number;
    direccion?: string;
  };
  destino: {
    nombre: string;
    latitud: number;
    longitud: number;
    direccion?: string;
  };
  fechaHora: string; // ISO String o Date
  asientosReservados: number;
  precioTotal: number;
  distanciaKm?: number;
  duracionMinutos?: number;

  fechaHoraInicio: string; // ISO String
  fechaHoraFin?: string;   // ISO String
  cantPasajeros: number;
  cantValijas?: number;
  precio: number;
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

    // 3. Instanciar y guardar la nueva reserva (incluyendo 'estado')
    const nuevaReserva = em.create(Reserva, {
      usuario: idUsuario as any,
      viaje: viaje,
      origen: data.origen,
      destino: data.destino,
      cantPasajeros: data.cantPasajeros,
      cantValijas: data.cantValijas,
      precio: data.precio,
      estado: data.estado ?? EstadoReserva.CONFIRMADA,
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

  static async obtenerPorViaje(idViaje: string) {
    const em = getEM().fork();
    return await em.find(
      Reserva,
      { viaje: idViaje },
      {
        populate: ['usuario', 'viaje'],
        orderBy: { createdAt: 'desc' },
      }
    );
  }

  static async actualizar(id: string, data: ActualizarReservaInput) {
    const em = getEM().fork();
    const reserva = await em.findOneOrFail(Reserva, { id });

    if (data.origen !== undefined) reserva.origen = data.origen;
    if (data.destino !== undefined) reserva.destino = data.destino;
    if (data.cantPasajeros !== undefined) reserva.cantPasajeros = data.cantPasajeros;
    if (data.cantValijas !== undefined) reserva.cantValijas = data.cantValijas;
    if (data.precio !== undefined) reserva.precio = data.precio;
    if (data.estado !== undefined) reserva.estado = data.estado;
    if (data.pagoAbonado !== undefined) reserva.pagoAbonado = data.pagoAbonado;
    if (data.habilitado !== undefined) reserva.habilitado = data.habilitado;

    await em.flush();

    return await em.findOneOrFail(Reserva, id, {
      populate: ['usuario', 'viaje'],
    });
  }

  static async eliminar(id: string) {
    const em = getEM().fork();
    const reserva = await em.findOneOrFail(
      Reserva, 
      { id }, 
      { populate: ['viaje'] }
    );

    const viajeAsociado = reserva.viaje;

    if (viajeAsociado && viajeAsociado.tipo === TipoViaje.PRIVADO) {
      em.remove(viajeAsociado);
    } else {
      em.remove(reserva);
    }

    await em.flush();

    return true;
  }

  static async crearReservaPrivada(datos: CrearReservaPrivadaInput) {
    const globalEm = getEM();

    //  Transacción atómica: si algo falla, no se guarda nada
    return await globalEm.transactional(async (em) => {
      // 1. Cargar Puntos (Origen y Destino)
      const puntoOrigen = em.create(Punto, {
        nombre: datos.origen.nombre,
        tipo: 'ORIGEN', // 👈 Campo requerido por Punto.entity.ts
        latitud: String(datos.origen.latitud),
        longitud: String(datos.origen.longitud),
        direccion: datos.origen.direccion || '',
      });

      const puntoDestino = em.create(Punto, {
        nombre: datos.destino.nombre,
        tipo: 'DESTINO', // 👈 Campo requerido por Punto.entity.ts
        latitud: String(datos.destino.latitud),
        longitud: String(datos.destino.longitud),
        direccion: datos.destino.direccion || '',
      });

      em.persist([puntoOrigen, puntoDestino]);

      // 2. Cargar la Ruta
      const nuevaRuta = em.create(Ruta, {
        nombre: `Ruta Privada: ${datos.origen.nombre} - ${datos.destino.nombre}`, 
        origen: puntoOrigen,
        destino: puntoDestino,
        precio: datos.precio,
      });

      em.persist(nuevaRuta);

      const fechaInicio = new Date(datos.fechaHoraInicio);
      const fechaFin = datos.fechaHoraFin
        ? new Date(datos.fechaHoraFin)
        : new Date(fechaInicio.getTime() + (datos.duracionMinutos || 60) * 60000);

      // 3. Cargar el Viaje Privado
      const nuevoViaje = em.create(Viaje, {
        ruta: nuevaRuta,
        // fechaHoraInicio: new Date(datos.fechaHora),
        tipo: TipoViaje.PRIVADO,
        fechaHoraInicio: fechaInicio, // 👈 Se reemplazó fechaHoraInicio
        fechaHoraFin: fechaFin,
        // estado: EstadoViaje.PROGRAMADO,
        // asientosDisponibles: datos.asientosReservados,
        // precioBase: datos.precioTotal,
        capacidadPasajeros: datos.cantPasajeros, // 👈 Se reemplazó asientosDisponibles
        capacidadValijas: datos.cantValijas || 0,
        precioBase: datos.precio,
      });

      em.persist(nuevoViaje);

      // 4. Cargar la Reserva
      const usuario = await em.findOneOrFail(Usuario, { id: datos.idUsuario });

      const nuevaReserva = em.create(Reserva, {
        usuario,
        viaje: nuevoViaje,
        // asientosReservados: datos.asientosReservados,
        // precioTotal: datos.precioTotal,
        // estado: EstadoReserva.CONFIRMADA, // o PENDIENTE según tu flujo
        // fechaReserva: new Date(),

        origen: datos.origen.nombre,
        destino: datos.destino.nombre,
        cantPasajeros: datos.cantPasajeros,
        cantValijas: datos.cantValijas || 0,
        precio: datos.precio,
        estado: EstadoReserva.CONFIRMADA, // 👈 Propiedad requerida por la entidad
        pagoAbonado: false,
        habilitado: true,
      });

      em.persist(nuevaReserva);

      // El flush() se ejecuta automáticamente al salir con éxito de la transacción
      return nuevaReserva;
    });
  }
}