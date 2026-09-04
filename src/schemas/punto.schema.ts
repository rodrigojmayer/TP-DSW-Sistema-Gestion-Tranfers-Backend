import { z } from 'zod';

export const crearPuntoSchema = z.object({
  nombre: z
    .string({ message: 'El nombre del punto es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  latitud: z
    .number({ message: 'La latitud debe ser un número' })
    .min(-90, 'La latitud mínima es -90')
    .max(90, 'La latitud máxima es 90'),
  longitud: z
    .number({ message: 'La longitud debe ser un número' })
    .min(-180, 'La longitud mínima es -180')
    .max(180, 'La longitud máxima es 180'),
});

export const actualizarPuntoSchema = crearPuntoSchema.partial();