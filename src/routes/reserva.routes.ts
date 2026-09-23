import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearReservaSchema, actualizarReservaSchema } from '../schemas/reserva.schema.js';

const router = Router();

router.use(autenticarToken);

router.get('/', ReservaController.obtenerTodas);
router.get('/:id', ReservaController.obtenerPorId);
router.post('/', validarSchema(crearReservaSchema), ReservaController.crear);
router.patch('/:id', validarSchema(actualizarReservaSchema), ReservaController.actualizar);
router.delete('/:id', ReservaController.eliminar);

export default router;