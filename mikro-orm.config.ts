/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { UsuarioSchema } from './src/entities/Usuario.entity.js';
import { PuntoSchema } from './src/entities/Punto.entity.js';
import { RutaSchema } from './src/entities/Ruta.entity.js';
import { ReservaSchema } from './src/entities/Reserva.entity.js';
import { PuntoRutaSchema } from './src/entities/PuntoRuta.entity.js';
import { Migrator } from '@mikro-orm/migrations';
import path from 'path';

export default defineConfig({
  entities: [UsuarioSchema, PuntoSchema, RutaSchema, ReservaSchema, PuntoRutaSchema],
  clientUrl: process.env.DATABASE_URL,
  extensions: [Migrator],
  schema: 'public',
migrations: {
  path: 'src/migrations',
  pathTs: 'src/migrations',
  glob: '!*\\.d\\.{ts,js}',
},
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: ['auth', 'storage', 'realtime', 'vault', 'extensions', 'pg_catalog', 'information_schema'], // 👈 Esto evita que intente modificar las tablas del sistema de Supabase
  },
});