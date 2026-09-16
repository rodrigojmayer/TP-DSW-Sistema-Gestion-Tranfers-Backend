import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Punto } from './Punto.entity.js';

export class Ruta {
  id: string = uuidv4();
  nombre!: string;precio!: number;
  origen!: Punto;
  destino!: Punto;
}

export const RutaSchema = new EntitySchema<Ruta>({
  class: Ruta,
  collection: 'ruta',
  properties: {
    id: { type: 'uuid', primary: true },
    nombre: { type: 'string' },
    precio: { type: 'float', nullable: true }, // Coincide con float4 de Supabase
    origen: {
      entity: () => Punto,
      joinColumn: 'origen_id',
      kind: 'm:1',
      nullable: true,
    },
    destino: {
      entity: () => Punto,
      joinColumn: 'destino_id',
      kind: 'm:1',
      nullable: true,
    },
  },
});