import { z } from 'zod';

// Esquema para validar el punto dentro de una ruta
const puntoEnRutaSchema = z.object({
    idPunto: z
        .string({ message: 'El idPunto debe ser un texto válido' })
        .uuid('El idPunto debe ser un UUID válido'),
        orden: z
        .number({ message: 'El orden es requerido' })
        .int('El orden debe ser un número entero')
        .positive('El orden debe ser un número entero positivo'),
});

// Esquema para CREAR una Ruta
export const crearRutaSchema = z.object({
    nombre: z
        .string({ message: 'El nombre de la ruta es obligatorio' })
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
    puntos: z.array(puntoEnRutaSchema).optional(),
});

// Esquema para ACTUALIZAR una Ruta
export const actualizarRutaSchema = crearRutaSchema.partial();