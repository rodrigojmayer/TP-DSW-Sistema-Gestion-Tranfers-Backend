import { prisma } from '../lib/prisma.js';

export class RutaService {
  static async actualizar(idRuta: string, data: { nombre?: string; puntos?: { idPunto: string; orden: number }[] }) {
    const { nombre, puntos } = data;

    return await prisma.$transaction(async (tx) => {
      if (puntos) {
        await tx.puntoRuta.deleteMany({
          where: { idRuta }
        });
      }

      return await tx.ruta.update({
        where: { idRuta },
        data: {
          ...(nombre && { nombre }),
          ...(puntos && {
            puntos: {
              create: puntos.map((p) => ({
                idPunto: p.idPunto,
                orden: p.orden
              }))
            }
          })
        },
        include: {
          puntos: {
            include: { punto: true },
            orderBy: { orden: 'asc' }
          }
        }
      });
    })
  }
  static async obtenerTodas() {
    return await prisma.ruta.findMany({
      include: {
        puntos: {
          orderBy: { orden: 'asc' },
          include: {
            punto: true, // Retorna los datos completos del punto del catálogo
          },
        },
      },
    });
  }

  static async obtenerPorId(id: string) {
    return await prisma.ruta.findUnique({
      where: { idRuta: id },
      include: {
        puntos: {
          orderBy: { orden: 'asc' },
          include: {
            punto: true,
          },
        },
      },
    });
  }

  static async crear(datos: {
    nombre: string;
    puntos: { idPunto: string; orden: number }[];
  }) {
    const nuevaRuta = await prisma.ruta.create({
      data: {
        nombre: datos.nombre,
        puntos: {
          create: datos.puntos.map((p) => ({
            idPunto: p.idPunto,
            orden: p.orden,
          })),
        },
      },
    });

    return await this.obtenerPorId(nuevaRuta.idRuta);
  }

  static async eliminar(id: string) {
    return await prisma.ruta.delete({
      where: { idRuta: id },
    });
  }
}