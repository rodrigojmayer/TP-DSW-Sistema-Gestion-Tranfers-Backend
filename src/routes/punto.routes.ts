import { Router } from 'express';
import { PuntoController } from '../controllers/punto.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

router.get('/', PuntoController.obtenerTodos);
router.get('/:id', PuntoController.obtenerPorId);
router.post('/', PuntoController.crear);
router.patch('/:id', PuntoController.actualizar);
router.delete('/:id', PuntoController.eliminar);

export default router;