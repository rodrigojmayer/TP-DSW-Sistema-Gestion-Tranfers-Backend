import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller.js';
import { autenticarToken, autenticarTokenOpcional } from '../middlewares/auth.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearReservaSchema, actualizarReservaSchema } from '../schemas/reserva.schema.js';

const router = Router();

// 1. RUTA PÚBLICA / EXPRES: Permite a invitados crear una reserva sin token
router.post('/', autenticarTokenOpcional, validarSchema(crearReservaSchema), ReservaController.crear);

// 2. RUTAS PROTEGIDAS: Consultar, modificar o eliminar reservas requiere sesión
router.get('/', autenticarToken, ReservaController.obtenerTodas);
router.get('/cliente/:idCliente',autenticarToken, ReservaController.obtenerPorCliente);

router.get('/:id', autenticarToken, ReservaController.obtenerPorId);
router.patch('/:id', autenticarToken, validarSchema(actualizarReservaSchema), ReservaController.actualizar);
router.delete('/:id', autenticarToken, ReservaController.eliminar);

export default router;