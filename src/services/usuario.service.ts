import bcrypt from 'bcryptjs';
import { wrap, EntityData } from '@mikro-orm/core';
import { getEM } from '../lib/db.js';
import { Usuario, Rol } from '../entities/Usuario.entity.js';

export interface CrearInvitadoInput {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
}

export class UsuarioService {
  static async obtenerOCrearInvitado(datos: CrearInvitadoInput) {
    const em = getEM().fork();

    // 1. Buscar si ya existe un usuario con ese email o DNI
    let usuario = await em.findOne(Usuario, {
      $or: [{ email: datos.email }, { dni: datos.dni }],
    });

    // 2. Si no existe, creamos el usuario invitado sin contraseña
    if (!usuario) {
      usuario = em.create(Usuario, {
        usuario: datos.email, // El username puede ser el propio email
        nombre: datos.nombre,
        apellido: datos.apellido,
        dni: datos.dni,
        email: datos.email,
        telefono: datos.telefono || '',
        password: null, // Sin contraseña asignada
        rol: Rol.CLIENTE,
        esInvitado: true,
        habilitado: true,
      });

      em.persist(usuario);
      await em.flush();
    }

    return usuario;
  }
  
  static async obtenerTodos() {
    const em = getEM();
    const usuarios = await em.find(Usuario, {});
    
    // Mapeamos para excluir la contraseña de todos los elementos de la lista
    return usuarios.map(u => {
      const { password, ...usuarioSinPassword } = wrap(u).toObject();
      return usuarioSinPassword;
    });
  }

  static async obtenerPorId(idUsuario: string) {
    const em = getEM();
    const usuario = await em.findOne(Usuario, { id: idUsuario });
    
    if (!usuario) {
      return null;
    }

    const { password, ...usuarioSinPassword } = wrap(usuario).toObject();
    return usuarioSinPassword;
  }

  static async crear(datos: {
    usuario: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    dni?: string;
    telefono?: string;
    rol?: Rol | string;
    habilitado?: boolean;
    nroLicencia?: string;
    vencimientoLicencia?: string;
  }) {
    const em = getEM();
    const hashedPassword = await bcrypt.hash(datos.password, 10);

    // Si el rol es OPERADOR o CHOFER, se deshabilita por defecto (false)
    const rolAsignado = datos.rol || Rol.CLIENTE;
    const esRolRestringido = rolAsignado === Rol.OPERADOR || rolAsignado === Rol.CHOFER;
    
    // Si viene explícitamente el valor de habilitado se respeta; de lo contrario, aplica la regla por rol
    const estadoHabilitado = datos.habilitado !== undefined ? datos.habilitado : !esRolRestringido;

    const nuevoUsuario = em.create(Usuario, {
      ...datos,
      rol: rolAsignado,
      password: hashedPassword,
      habilitado: estadoHabilitado,
    } as any);

    em.persist(nuevoUsuario);
    await em.flush();

    const { password, ...usuarioSinPassword } = wrap(nuevoUsuario).toObject();
    return usuarioSinPassword;
  }

  static async actualizar(
    idUsuario: string,
    data: {
      usuario?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      telefono?: string;
      dni?: string;
      rol?: Rol | string;
      habilitado?: boolean;
      password?: string;
      nroLicencia?: string;
      vencimientoLicencia?: string;
    }
  ) {
    const em = getEM();
    const usuario = await em.findOneOrFail(Usuario, { id: idUsuario });

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const datosLimpios = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== '')
    );

    em.assign(usuario, datosLimpios as EntityData<Usuario>);
    await em.flush();

    const { password, ...usuarioSinPassword } = wrap(usuario).toObject();
    return usuarioSinPassword;
  }

  static async eliminar(idUsuario: string) {
    const em = getEM();
    const usuario = await em.findOneOrFail(Usuario, { id: idUsuario });
    
    em.remove(usuario);
    await em.flush();
    return true;
  }
}