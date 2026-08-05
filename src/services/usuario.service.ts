import { prisma } from '../lib/prisma.js';
import { Rol } from '@prisma/client';

export class UsuarioService {
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