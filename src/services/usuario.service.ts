import { prisma } from '../lib/prisma.js';
import { Rol } from '@prisma/client';

export class UsuarioService {
  static async actualizar(idUsuario: string, data: { nombre?: string; email?: string; password?: string }) {
    return await prisma.usuario.update({
      where: { idUsuario }, 
      data: {
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }) // Nota: hashear antes de guardar
      },
      select: {
        idUsuario: true,
        nombre: true,
        email: true,
        createdAt: true,
        updatedAt: true
        // Excluimos 'password' por seguridad para no retornar el hash
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
    return await prisma.usuario.create({
      data: datos,
    });
  }

  static async eliminar(id: string) {
    return await prisma.usuario.delete({
      where: { idUsuario: id },
    });
  }
}