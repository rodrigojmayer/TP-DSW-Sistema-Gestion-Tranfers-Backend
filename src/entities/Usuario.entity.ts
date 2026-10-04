import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export enum Rol {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
  CLIENTE = 'CLIENTE',
  CHOFER = 'CHOFER',
}

export class Usuario {
  id: string = uuidv4();
  usuario!: string;
  nombre!: string;
  apellido!: string;
  email!: string;
  password?: string | null;
  rol: Rol = Rol.CLIENTE;
  habilitado: boolean = true; // Agregado
  esInvitado: boolean = false;

  dni?: string;
  telefono?: string;
  nroLicencia?: string;
  vencimientoLicencia?: string;
}

export const UsuarioSchema = new EntitySchema<Usuario>({
  class: Usuario,
  collection: 'usuarios',
  properties: {
    id: { type: 'uuid', primary: true },
    usuario: { type: 'string', unique: true },
    nombre: { type: 'string' },
    apellido: { type: 'string' },
    email: { type: 'string', unique: true },
    password: { type: 'string', nullable: true },
    rol: { enum: true, items: () => Rol, default: Rol.CLIENTE },
    habilitado: { type: 'boolean', default: true }, // Agregado
    esInvitado: { type: 'boolean', default: false },

    // opcionales
    dni: { type: 'string', nullable: true },
    telefono: { type: 'string', nullable: true },
    nroLicencia: { type: 'string', nullable: true },
    vencimientoLicencia: { type: 'string', nullable: true },
  },
});