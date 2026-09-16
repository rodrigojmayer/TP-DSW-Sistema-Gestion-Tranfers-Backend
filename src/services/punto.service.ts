import { EntityData, wrap } from '@mikro-orm/core';
import { getEM } from '../lib/db.js';
import { Punto } from '../entities/Punto.entity.js';

export class PuntoService {
  static async obtenerTodos() {
    const em = getEM();
    return await em.find(Punto, {}, { orderBy: { nombre: 'asc' } });
  }

  static async obtenerPorId(id: string) {
    const em = getEM();
    return await em.findOne(Punto, { id });
  }

  static async crear(datos: { direccion: string; nombre?: string }) {
    const em = getEM();
    const nuevoPunto = em.create(Punto, datos as any);

    console.log('DATOS QUE RECIBE EL SERVICE crear:', datos);
    console.log('nuevoPunto crear:', nuevoPunto);
    em.persist(nuevoPunto);
    await em.flush();

    return nuevoPunto;
  }
    
  static async crearMasivo(datosArray: any[]) {
    const em = getEM();
    const nuevosPuntos = [];

   console.log('DATOS QUE RECIBE EL SERVICE crear:', datosArray); 

    for (const datos of datosArray) {
      const punto = em.create(Punto, datos);
      em.persist(punto);
      nuevosPuntos.push(punto);
    }

    await em.flush();
    return nuevosPuntos;
  }

  // static async actualizar(idPunto: string, data: { nombre?: string; direccion?: string }) {
  static async actualizar(id: string, data: any) {
    const em = getEM();
    const punto = await em.findOneOrFail(Punto, { id });

    console.log('DATOS QUE RECIBE EL SERVICE:', data, 'TIPO DE LATITUD:', typeof data.latitud);
    
    em.assign(punto, data as EntityData<Punto>);
    await em.flush();

    return punto;
  }
  
  static async eliminar(id: string) {
    const em = getEM();
    const punto = await em.findOneOrFail(Punto, { id });
    
    em.remove(punto);
    await em.flush();
    
    return true;
  }
}