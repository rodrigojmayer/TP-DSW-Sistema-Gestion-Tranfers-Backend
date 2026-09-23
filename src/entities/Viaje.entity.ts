// src/entities/Viaje.entity.ts
import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export class Viaje {
  id: string = uuidv4();
}

export const ViajeSchema = new EntitySchema<Viaje>({
  class: Viaje,
  collection: 'viaje',
  properties: {
    id: { type: 'uuid', primary: true },
  },
});