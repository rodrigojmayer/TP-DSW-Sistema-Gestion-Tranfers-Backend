import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Ruta } from './Ruta.entity.js';
import { Punto } from './Punto.entity.js';

export class PuntoRuta {
  id: string = uuidv4();
  ruta!: Ruta;
  punto!: Punto;
  orden!: number;
}

export const PuntoRutaSchema = new EntitySchema<PuntoRuta>({
  class: PuntoRuta,
  collection: 'punto_ruta',
  properties: {
    id: { type: 'uuid', primary: true },
    ruta: { 
      kind: 'm:1', 
      entity: () => Ruta, 
      deleteRule: 'cascade' //  Se usa deleteRule en lugar de onDelete
    },
    punto: { 
      kind: 'm:1', 
      entity: () => Punto, 
      deleteRule: 'cascade' //  Se usa deleteRule en lugar de onDelete
    },
    orden: { type: 'number' },
  },
});