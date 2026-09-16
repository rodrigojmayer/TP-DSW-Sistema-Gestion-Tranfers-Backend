import { z } from 'zod';

export enum TipoViaje {
  COMPARTIDO = 'COMPARTIDO',
  PRIVADO = 'PRIVADO',
}

export const crearReservaSchema = z.object({
  origen: z.string({ message: 'El origen es requerido' }).min(3, 'El origen debe ser más claro'),
  destino: z.string({ message: 'El destino es requerido' }).min(3, 'El destino debe ser más claro'),
  fechaHoraInicio: z.string({ message: 'La fecha y hora de inicio es requerida' }).datetime({ message: 'Debe ser un formato ISO válido' }),
  fechaHoraFin: z.string({ message: 'La fecha y hora de fin es requerida' }).datetime({ message: 'Debe ser un formato ISO válido' }),
  cantPasajeros: z.number({ message: 'La cantidad de pasajeros debe ser un número' }).int().positive(),
  cantValijas: z.number({ message: 'La cantidad de valijas debe ser un número' }).int().min(0),
  precio: z.number({ message: 'El precio debe ser un número' }).positive(),
  tipo: z.nativeEnum(TipoViaje, { message: 'El tipo debe ser COMPARTIDO o PRIVADO' }),
  
  // Campos condicionales para viajes compartidos
  idRuta: z.string().uuid({ message: 'El idRuta debe ser un UUID válido' }).optional(),
  descuento: z.number().min(0).max(100).optional(),
}).refine((data) => {
  if (data.tipo === TipoViaje.COMPARTIDO && !data.idRuta) {
    return false;
  }
  return true;
}, {
  message: 'Una reserva de tipo COMPARTIDO requiere indicar un idRuta',
  path: ['idRuta'],
});

export const actualizarReservaSchema = crearReservaSchema.partial();