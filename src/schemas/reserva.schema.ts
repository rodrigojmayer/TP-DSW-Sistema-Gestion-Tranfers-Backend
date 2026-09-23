import { z } from 'zod';

const reservaBaseSchema = z.object({
  idViaje: z.string().uuid({ message: 'El idViaje debe ser un UUID válido' }),
  origen: z.string().min(3, 'El origen debe ser especificado'),
  destino: z.string().min(3, 'El destino debe ser especificado'),
  cantPasajeros: z.number({ message: 'La cantidad de pasajeros debe ser un número' }).int().positive(),
  cantValijas: z.number({ message: 'La cantidad de valijas debe ser un número' }).int().min(0),
  precio: z.number({ message: 'El precio debe ser un número' }).positive(),
  pagoAbonado: z.boolean().optional(),
  habilitado: z.boolean().optional(),
});

export const crearReservaSchema = reservaBaseSchema;
export const actualizarReservaSchema = reservaBaseSchema.partial();