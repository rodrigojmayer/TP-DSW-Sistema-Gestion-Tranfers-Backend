import { z } from 'zod';

const ROLES = ['ADMIN', 'OPERADOR', 'CHOFER', 'CLIENTE'] as const;

export const crearUsuarioBackendSchema = z.object({
  usuario: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellido: z.string().min(2, 'El apellido es obligatorio'),
  email: z.string().email('Debe ser un email válido'),
  dni: z.string().min(6).max(8).optional(),
  telefono: z.string().optional(),
  rol: z.enum(ROLES).default('CLIENTE'),
  nroLicencia: z.string().optional(),
  vencimientoLicencia: z.string().optional(),
});

export const actualizarUsuarioBackendSchema = crearUsuarioBackendSchema
  .partial()
  .omit({ password: true })
  .extend({
    // Permite que password sea opcional, min 6 caracteres o string vacío ("")
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .optional()
      .or(z.literal('')),
  });