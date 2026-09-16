import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearReservaSchema } from '../schemas/reserva.schema.js';

const router = Router();

///////////////////////////////////////////////////////////// COMENTADO PARA HACER PRUEBAS
// router.use(autenticarToken);

router.get('/', ReservaController.obtenerTodas);
router.post('/', validarSchema(crearReservaSchema), ReservaController.crear);

export default router;