import { prisma } from '../lib/prisma.js';

export class PuntoService {
  static async obtenerTodos() {
    return await prisma.punto.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  static async obtenerPorId(id: string) {
    return await prisma.punto.findUnique({
      where: { idPunto: id },
    });
  }

  static async crear(datos: { direccion: string; nombre?: string }) {
    return await prisma.punto.create({
      data: datos,
    });
  }

  static async eliminar(id: string) {
    return await prisma.punto.delete({
      where: { idPunto: id },
    });
  }
}