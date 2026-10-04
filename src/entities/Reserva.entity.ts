import { EntitySchema, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from './Usuario.entity.js';
import { Viaje } from './Viaje.entity.js';

export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
}

export class Reserva {
  id: string = uuidv4();
  usuario!: Usuario;
  viaje!: Viaje;

  origen!: string;
  destino!: string;
  cantPasajeros!: number;
  cantValijas!: number;
  precio!: number;
  
  estado: EstadoReserva = EstadoReserva.CONFIRMADA;
  pagoAbonado: boolean = false;
  habilitado: boolean = true;

  createdAt?: Date = new Date();
}

export const ReservaSchema = new EntitySchema<Reserva>({
  class: Reserva,
  collection: 'reserva',
  properties: {
    id: { type: 'uuid', primary: true },
    usuario: { kind: 'm:1', entity: () => Usuario },
    viaje: { 
      kind: 'm:1', 
      entity: () => Viaje, 
      deleteRule: 'cascade'      
    },
    origen: { type: 'string' },
    destino: { type: 'string' },
    cantPasajeros: { type: 'number' },
    cantValijas: { type: 'number' },
    precio: { type: 'float' },
    estado: { type: 'string', default: EstadoReserva.CONFIRMADA },
    pagoAbonado: { type: 'boolean', default: false },
    habilitado: { type: 'boolean', default: true },
    createdAt: { type: 'Date', defaultRaw: 'now()', nullable: true },
  },
});