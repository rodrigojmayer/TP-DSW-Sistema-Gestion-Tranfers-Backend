import { z } from 'zod';

const puntoUnicoSchema = z.object({
  nombre: z
    .string({ message: 'El nombre del punto es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  tipo: z.string({ message: "El tipo es obligatorio" }),
  latitud: z
    .string({ message: 'La latitud es obligatoria' }),
  longitud: z
    .string({ message: 'La longitud es obligatoria' }),
  direccion: z
    .string({ message: 'La direccion es obligatoria' }),
});

// Acepta un objeto suelto O un array de objetos
export const crearPuntoSchema = z.union([
  puntoUnicoSchema,
  z.array(puntoUnicoSchema)
]);

export const actualizarPuntoSchema = puntoUnicoSchema.partial();