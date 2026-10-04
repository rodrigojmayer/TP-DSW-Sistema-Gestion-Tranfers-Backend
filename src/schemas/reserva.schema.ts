import { z } from 'zod';

// 1. Objeto base sin refinamientos (aquí SÍ se puede usar .partial())
const reservaShape = z.object({
  // Identificador del viaje: Hacemos opcional/permitimos string vacío para cuando sea PRIVADO
  idViaje: z.string().optional().or(z.literal('')),

  // Modalidad del viaje
  tipoViaje: z.enum(['COMPARTIDO', 'PRIVADO'] as const, {
    message: 'El tipo de viaje debe ser COMPARTIDO o PRIVADO',
  }).optional().default('COMPARTIDO'),

  // Tramo seleccionado
  origen: z.string().min(3, 'El origen debe ser especificado y tener al menos 3 caracteres'),
  destino: z.string().min(3, 'El destino debe ser especificado y tener al menos 3 caracteres'),

  // Ocupación y asientos
  asiento: z.number().int().min(1).optional().default(1),
  cantPasajeros: z.number({ message: 'La cantidad de pasajeros debe ser un número' }).int().positive().default(1),
  cantValijas: z.number({ message: 'La cantidad de valijas debe ser un número' }).int().min(0).default(0),

  // Precios
  precio: z.number({ message: 'El precio debe ser un número' }).positive().optional(),
  precioFinal: z.number().positive({ message: 'El precio debe ser un número positivo' }).optional(),

  // Tipo de reserva e identidad del cliente
  tipoReserva: z.enum(['LOGUEADO', 'INVITADO']).optional(),
  idCliente: z.string().optional().or(z.literal('')),

  // Datos opcionales del pasajero / invitado
  pasajeroNombre: z.string().optional(),
  pasajeroApellido: z.string().optional(),
  pasajeroDni: z.string().optional(),
  pasajeroEmail: z.string().optional(),
  pasajeroTelefono: z.string().optional(),

  // Banderas de estado
  pagoAbonado: z.boolean().optional().default(false),
  habilitado: z.boolean().optional().default(true),
});

// 2. Esquema de creación (Objeto base + Refinamientos)
export const crearReservaSchema = reservaShape
  .refine(
    data => data.precio !== undefined || data.precioFinal !== undefined, 
    {
      message: 'Debe proporcionar al menos el precio o precioFinal',
      path: ['precioFinal'],
    }
  )
  .refine(
    data => {
      // Si el viaje es COMPARTIDO, exigimos que idViaje exista y no esté vacío
      if (data.tipoViaje === 'COMPARTIDO') {
        return !!data.idViaje && data.idViaje.trim() !== '';
      }
      return true; // Si es PRIVADO, no exige idViaje
    },
    {
      message: 'Debe seleccionar un viaje programado',
      path: ['idViaje'],
    }
  );

// 3. Esquema de actualización
export const actualizarReservaSchema = reservaShape.partial();