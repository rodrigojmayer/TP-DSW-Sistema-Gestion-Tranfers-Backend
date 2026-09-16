import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export class Punto {
  id: string = uuidv4();
  nombre!: string;
  tipo!: string; // Ej: 'Terminal', 'Aeropuerto', 'Punto Intermedio'
  latitud!: string; 
  longitud!: string; 
  direccion!: string; 
}

export const PuntoSchema = new EntitySchema<Punto>({
  class: Punto,
  collection: 'punto',
  properties: {
    id: { type: 'uuid', primary: true },
    nombre: { type: 'string' },
    tipo: { type: 'string' },
    latitud: { type: 'string' },
    longitud: { type: 'string' },
    direccion: { type: 'string' },
  },
});