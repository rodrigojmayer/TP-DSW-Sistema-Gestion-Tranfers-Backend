import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Ruta } from './Ruta.entity.js';
import { Usuario } from './Usuario.entity.js';

export class Reserva {
  id: string = uuidv4();
  usuario!: Usuario;
  ruta!: Ruta;
  fechaViaje!: Date;
  estado: string = 'PENDIENTE';
  createdAt: Date = new Date();
}

export const ReservaSchema = new EntitySchema<Reserva>({
  class: Reserva,
  properties: {
    id: { type: 'uuid', primary: true },
    usuario: { kind: 'm:1', entity: () => Usuario },
    ruta: { kind: 'm:1', entity: () => Ruta },
    fechaViaje: { type: 'date' },
    estado: { type: 'string', default: 'PENDIENTE' },
    createdAt: { type: 'Date', defaultRaw: 'now()' },
  },
});