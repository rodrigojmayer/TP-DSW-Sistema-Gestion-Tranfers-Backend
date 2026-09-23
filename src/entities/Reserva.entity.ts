import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from './Usuario.entity.js';
import { Viaje } from './Viaje.entity.js';

export class Reserva {
  id: string = uuidv4();
  usuario!: Usuario;
  viaje!: Viaje;

  origen!: string;
  destino!: string;
  cantPasajeros!: number;
  cantValijas!: number;
  precio!: number;
  
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
    viaje: { kind: 'm:1', entity: () => Viaje },
    origen: { type: 'string' },
    destino: { type: 'string' },
    cantPasajeros: { type: 'number' },
    cantValijas: { type: 'number' },
    precio: { type: 'float' },
    pagoAbonado: { type: 'boolean', default: false },
    habilitado: { type: 'boolean', default: true },
    createdAt: { type: 'Date', defaultRaw: 'now()', nullable: true },
  },
});