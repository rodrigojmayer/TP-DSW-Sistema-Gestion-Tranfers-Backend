import bcrypt from 'bcryptjs';
import { wrap, EntityData } from '@mikro-orm/core';
import { getEM } from '../lib/db.js';
import { Usuario } from '../entities/Usuario.entity.js';

export class UsuarioService {
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
    telefono?: string;
    rol?: string;
  }) {
    const em = getEM();
    const hashedPassword = await bcrypt.hash(datos.password, 10);

    const nuevoUsuario = em.create(Usuario, {
      ...datos,
      password: hashedPassword,
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
      rol?: string;
      password?: string;
    }
  ) {
    const em = getEM();
    const usuario = await em.findOneOrFail(Usuario, { id: idUsuario });

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const datosLimpios = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
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