// src/entities/Viaje.entity.ts
import { EntitySchema, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Ruta } from './Ruta.entity.js';
import { Reserva } from './Reserva.entity.js';
import { Usuario } from './Usuario.entity.js';

export enum TipoViaje {
  COMPARTIDO = 'COMPARTIDO',
  PRIVADO = 'PRIVADO',
}

export class Viaje {
  id: string = uuidv4();
  tipo: TipoViaje = TipoViaje.COMPARTIDO;

  fechaHoraInicio!: Date;
  fechaHoraFin!: Date;

  capacidadPasajeros!: number;
  capacidadValijas!: number;

  precioBase?: number;

  // Si es compartido, puede estar asociado a una Ruta predefinida
  ruta?: Ruta;

  chofer?: Usuario;

  // Un viaje tiene muchas reservas asociadas
  reservas = new Collection<Reserva>(this);

  createdAt?: Date = new Date();
}

export const ViajeSchema = new EntitySchema<Viaje>({
  class: Viaje,
  collection: 'viaje',
  properties: {
    id: { type: 'uuid', primary: true },
    tipo: { type: 'string', default: TipoViaje.COMPARTIDO },
    fechaHoraInicio: { type: 'Date' },
    fechaHoraFin: { type: 'Date' },
    capacidadPasajeros: { type: 'number' },
    capacidadValijas: { type: 'number' },
    precioBase: { type: 'float', nullable: true },
    ruta: { kind: 'm:1', entity: () => Ruta, nullable: true },
    chofer: { kind: 'm:1', entity: () => Usuario, nullable: true },
    reservas: { kind: '1:m', entity: () => Reserva, mappedBy: 'viaje' },
    createdAt: { type: 'Date', defaultRaw: 'now()', nullable: true },
  },
});