import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { Rol } from '@prisma/client';

export class UsuarioService {
  static async actualizar(
    idUsuario: string, 
    data: { 
      usuario?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      telefono?: string;
      rol?: Rol;
      password?: string;
    }) {

    let hashedPassword = undefined;

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }
    return await prisma.usuario.update({
      where: { idUsuario }, 
      data: {
        ...(data.usuario && { usuario: data.usuario }),
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.apellido && { apellido: data.apellido }),
        ...(data.email && { email: data.email }),
        ...(data.telefono && { telefono: data.telefono }),
        ...(data.rol && { rol: data.rol }),
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        idUsuario: true,
        usuario: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        rol: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }
  
  static async obtenerTodos() {
    return await prisma.usuario.findMany({
      select: {
        idUsuario: true,
        usuario: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        rol: true,
        createdAt: true,
      },
    });
  }

  static async obtenerPorId(id: string) {
    return await prisma.usuario.findUnique({
      where: { idUsuario: id },
      select: {
        idUsuario: true,
        usuario: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        rol: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async crear(datos: {
    usuario: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    rol?: Rol;
  }) {
    const hashedPassword = await bcrypt.hash(datos.password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        ...datos,
        password: hashedPassword,
      },
    });

    const { password, ...usuarioSinPassword } = nuevoUsuario;
    return usuarioSinPassword;
  }

  static async eliminar(id: string) {
    return await prisma.usuario.delete({
      where: { idUsuario: id },
    });
  }
}