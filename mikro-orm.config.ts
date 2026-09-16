/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { UsuarioSchema } from './src/entities/Usuario.entity.js';
import { PuntoSchema } from './src/entities/Punto.entity.js';
import { RutaSchema } from './src/entities/Ruta.entity.js';
import { ReservaSchema } from './src/entities/Reserva.entity.js';
import { PuntoRutaSchema } from './src/entities/PuntoRuta.entity.js';

export default defineConfig({
  entities: [UsuarioSchema, PuntoSchema, RutaSchema, ReservaSchema, PuntoRutaSchema],
  clientUrl: process.env.DATABASE_URL,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
  },
});