import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller.js';
import { autenticarToken, autenticarTokenOpcional } from '../middlewares/auth.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearReservaSchema, actualizarReservaSchema } from '../schemas/reserva.schema.js';

const router = Router();

// 1. RUTA PÚBLICA / EXPRES: Permite a invitados crear una reserva sin token
router.post('/', autenticarTokenOpcional, validarSchema(crearReservaSchema), ReservaController.crear);

// RUTA PÚBLICA ANÓNIMA: Solo devuelve origen, destino y cantidad de pasajeros/valijas para hacer los cálculos
router.get('/viaje/:idViaje/ocupacion', ReservaController.obtenerOcupacionPublica);


// 2. RUTAS PROTEGIDAS: Consultar, modificar o eliminar reservas requiere sesión
router.get('/', autenticarToken, ReservaController.obtenerTodas);
router.get('/cliente/:idCliente',autenticarToken, ReservaController.obtenerPorCliente);

// RUTA PROTEGIDA: Devuelve los datos completos de los pasajeros (solo para usuarios autenticados/admin)
router.get('/viaje/:idViaje', autenticarToken, ReservaController.obtenerPorViaje);

router.get('/:id', autenticarToken, ReservaController.obtenerPorId);
router.patch('/:id', autenticarToken, validarSchema(actualizarReservaSchema), ReservaController.actualizar);
router.delete('/:id', autenticarToken, ReservaController.eliminar);

export default router;