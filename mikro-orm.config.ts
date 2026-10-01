/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { UsuarioSchema } from './src/entities/Usuario.entity.js';
import { PuntoSchema } from './src/entities/Punto.entity.js';
import { RutaSchema } from './src/entities/Ruta.entity.js';
import { ReservaSchema } from './src/entities/Reserva.entity.js';
import { ViajeSchema } from './src/entities/Viaje.entity.js';
import { PuntoRutaSchema } from './src/entities/PuntoRuta.entity.js';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  entities: [UsuarioSchema, PuntoSchema, RutaSchema, ReservaSchema, PuntoRutaSchema, ViajeSchema],
  clientUrl: process.env.DATABASE_URL,
  extensions: [Migrator],
  schema: 'public',

  // Configuración del pool de conexiones limpia sin 'driverOptions.connection'
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000,
  },

  migrations: {
    path: 'src/migrations',
    pathTs: 'src/migrations',
    glob: '!*\\.d\\.{ts,js}',
  },

  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: ['auth', 'storage', 'realtime', 'vault', 'extensions', 'pg_catalog', 'information_schema'],
  },
});