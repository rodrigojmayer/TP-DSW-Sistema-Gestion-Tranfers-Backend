import { z } from 'zod';

const puntoSchema = z.object({
  nombre: z.string(),
  latitud: z.number(),
  longitud: z.number(),
  direccion: z.string().optional(),
});

export const crearReservaPrivadaSchema = z.object({
  origen: puntoSchema,
  destino: puntoSchema,
  fechaHoraInicio: z.string(),
  fechaHoraFin: z.string().optional(),
  cantPasajeros: z.number().min(1),
  cantValijas: z.number().optional(),
  precio: z.number().positive(),
  distanciaKm: z.number().optional(),
  duracionMinutos: z.number().optional(),
  // Opcionales para invitados
  pasajeroNombre: z.string().optional(),
  pasajeroApellido: z.string().optional(),
  pasajeroDni: z.string().optional(),
  pasajeroEmail: z.string().optional(),
  pasajeroTelefono: z.string().optional(),
});