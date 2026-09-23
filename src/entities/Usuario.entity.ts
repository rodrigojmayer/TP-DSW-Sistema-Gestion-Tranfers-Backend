import { EntitySchema } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export class Usuario {
  id: string = uuidv4();
  usuario!: string;
  nombre!: string;
  apellido!: string;
  email!: string;
  password!: string;
  rol: string = 'CLIENTE';
  
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
    password: { type: 'string' },
    rol: { type: 'string', default: 'CLIENTE' },
    
    //opcionales
    dni: { type: 'string', nullable: true },
    telefono: { type: 'string', nullable: true },
    nroLicencia: { type: 'string', nullable: true },
    vencimientoLicencia: { type: 'string', nullable: true },
  },
});