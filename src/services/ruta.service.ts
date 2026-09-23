import { getEM } from '../lib/db.js';
import { Ruta } from '../entities/Ruta.entity.js';
import { Punto } from '../entities/Punto.entity.js';
import { PuntoRuta } from '../entities/PuntoRuta.entity.js';

export class RutaService {
  static async crearConPuntos(data: { nombre: string; precio?: number; puntos: { idPunto: string; orden: number }[] }) {
    const em = getEM();

    const puntosOrdenados = data.puntos.sort((a, b) => a.orden - b.orden);
  
    const origenId = puntosOrdenados[0]?.idPunto;
    const destinoId = puntosOrdenados[puntosOrdenados.length - 1]?.idPunto;
   
    const ruta = em.create(Ruta, {
      nombre: data.nombre,
      precio: data.precio || 0,
      origen: origenId,
      destino: destinoId,
    });

    em.persist(ruta);

    if (puntosOrdenados && puntosOrdenados.length > 0) {
      for (const item of puntosOrdenados) {
        const punto = await em.findOneOrFail(Punto, { id: item.idPunto });
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
    // const em = getEM();
    // return await em.find(Ruta, {}, { orderBy: { nombre: 'asc' } });
const em = getEM();
    // 1. Obtenemos todas las rutas ordenadas por nombre
    const rutas = await em.find(Ruta, {}, { orderBy: { nombre: 'asc' } });

    // 2. Para cada ruta, buscamos sus puntos asociados a través de PuntoRuta
    const rutasConPuntos = await Promise.all(
      rutas.map(async (ruta) => {
        const puntoRuta = await em.find(PuntoRuta, { ruta }, { populate: ['punto'] });
        
        return {
          ...ruta,
          puntos: puntoRuta.map(pr => ({
            ...pr.punto,
            orden: pr.orden,
          })),
        };
      })
    );

    return rutasConPuntos;
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

  static async actualizar(idRuta: string, data: { nombre?: string; precio?: number; puntos?: { idPunto: string; orden: number }[] }) {
    const em = getEM();
    const ruta = await em.findOneOrFail(Ruta, { id: idRuta });

    if (data.nombre !== undefined) {
      ruta.nombre = data.nombre;
    }
    if (data.precio !== undefined) {
      ruta.precio = data.precio;
    }

    // Si mandan nuevos puntos, actualizamos la relación pivote Y recalculamos origen/destino
    if (data.puntos && data.puntos.length > 0) {
      const puntosOrdenados = data.puntos.sort((a, b) => a.orden - b.orden);
      
      const origenId = puntosOrdenados[0]?.idPunto;
      const destinoId = puntosOrdenados[puntosOrdenados.length - 1]?.idPunto;

      // Actualizamos las referencias de origen y destino en la entidad principal Ruta
      if (origenId) {
        ruta.origen = em.getReference(Punto, origenId);
      }
      if (destinoId) {
        ruta.destino = em.getReference(Punto, destinoId);
      }

      // 1. Eliminamos los vínculos anteriores de esta ruta en la tabla intermedia
      const puntosViejos = await em.find(PuntoRuta, { ruta });
      em.remove(puntosViejos);

      // 2. Creamos los nuevos vínculos con el orden actualizado
      for (const item of puntosOrdenados) {
        const punto = await em.findOneOrFail(Punto, { id: item.idPunto });
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

    const puntosRutaAsociados = await em.find(PuntoRuta, { ruta });
    if (puntosRutaAsociados.length > 0) {
      em.remove(puntosRutaAsociados);
    }

    em.remove(ruta);
    await em.flush();
    return true;
  }
}