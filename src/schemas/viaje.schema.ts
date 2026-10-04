// src/schemas/viaje.schema.ts
import { z } from 'zod';
import { TipoViaje } from '../entities/Viaje.entity.js';

export { TipoViaje };

const viajeBaseSchema = z.object({
  tipo: z.nativeEnum(TipoViaje, { message: 'El tipo debe ser COMPARTIDO o PRIVADO' }),
  fechaHoraInicio: z.string({ message: 'Fecha de inicio requerida' }).datetime({ message: 'Formato ISO inválido' }),
  fechaHoraFin: z.string({ message: 'Fecha de fin requerida' }).datetime({ message: 'Formato ISO inválido' }),
  capacidadPasajeros: z.number().int().positive('Debe ser mayor a 0'),
  capacidadValijas: z.number().int().min(0),
  precioBase: z.number().positive().optional(),
  idRuta: z.string().uuid({ message: 'UUID de ruta inválido' }).optional(),
  idChofer: z.string().uuid().nullable().optional(),
});

export const crearViajeSchema = viajeBaseSchema.refine(
  (data) => new Date(data.fechaHoraFin) > new Date(data.fechaHoraInicio),
  {
    message: 'La fechaHoraFin debe ser posterior a fechaHoraInicio',
    path: ['fechaHoraFin'],
  }
);

export const actualizarViajeSchema = viajeBaseSchema.partial();