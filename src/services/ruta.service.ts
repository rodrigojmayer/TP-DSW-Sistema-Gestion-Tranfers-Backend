import { getEM } from '../lib/db.js';
import { Ruta } from '../entities/Ruta.entity.js';
import { Punto } from '../entities/Punto.entity.js';
import { PuntoRuta } from '../entities/PuntoRuta.entity.js';

export class RutaService {
  static async crearConPuntos(data: { nombre: string; precio?: number; puntos: { puntoId: string; orden: number }[] }) {
    const em = getEM();

    const puntosOrdenados = data.puntos.sort((a, b) => a.orden - b.orden);
  
    const origenId = puntosOrdenados[0]?.puntoId;
    const destinoId = puntosOrdenados[puntosOrdenados.length - 1]?.puntoId;
   
    const ruta = em.create(Ruta, {
      nombre: data.nombre,
      precio: data.precio || 0,
      origen: origenId,
      destino: destinoId,
    });

    em.persist(ruta);

    if (puntosOrdenados && puntosOrdenados.length > 0) {
      for (const item of puntosOrdenados) {
        const punto = await em.findOneOrFail(Punto, { id: item.puntoId });
        const puntoRuta = em.create(PuntoRuta, {
          ruta,
          punto,
          orden: item.orden,
        });
        em.persist(puntoRuta);
      }
    }

    await em.flush();
    return ruta;
  }

  static async obtenerTodas() {
    const em = getEM();
    return await em.find(Ruta, {}, { orderBy: { nombre: 'asc' } });
  }

  static async obtenerRutaConPuntos(idRuta: string) {
    const em = getEM();
    const ruta = await em.findOneOrFail(Ruta, { id: idRuta });
    const puntoRuta = await em.find(PuntoRuta, { ruta }, { populate: ['punto'] });

    return {
      ...ruta,
      puntos: puntoRuta.map(pr => ({
        ...pr.punto,
        orden: pr.orden,
      })),
    };
  }

  static async actualizar(idRuta: string, data: { nombre?: string; puntos?: { puntoId: string; orden: number }[] }) {
    const em = getEM();
    const ruta = await em.findOneOrFail(Ruta, { id: idRuta });

    if (data.nombre) {
      ruta.nombre = data.nombre;
    }

    // Si mandan nuevos puntos, actualizamos la relación pivote
    if (data.puntos) {
      // 1. Eliminamos los vínculos anteriores de esta ruta
      const puntosViejos = await em.find(PuntoRuta, { ruta });
      em.remove(puntosViejos);

      // 2. Creamos los nuevos vínculos con el orden actualizado
      for (const item of data.puntos) {
        const punto = await em.findOneOrFail(Punto, { id: item.puntoId });
        const puntoRuta = em.create(PuntoRuta, {
          ruta,
          punto,
          orden: item.orden,
        });
        em.persist(puntoRuta);
      }
    }

    await em.flush();
    return await this.obtenerRutaConPuntos(idRuta);
  }

  static async eliminar(idRuta: string) {
    const em = getEM();
    const ruta = await em.findOneOrFail(Ruta, { id: idRuta });

    // Gracias al deleteRule: 'cascade' en la entidad, al eliminar la ruta 
    // se limpian automáticamente los registros asociados en punto_ruta
    em.remove(ruta);
    await em.flush();
    return true;
  }
}