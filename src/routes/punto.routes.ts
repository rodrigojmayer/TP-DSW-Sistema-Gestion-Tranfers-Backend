import { Router } from 'express';
import { PuntoController } from '../controllers/punto.controller.js';

const router = Router();

router.get('/', PuntoController.obtenerTodos);
router.get('/:id', PuntoController.obtenerPorId);
router.post('/', PuntoController.crear);
router.patch('/:id', PuntoController.actualizar);
router.delete('/:id', PuntoController.eliminar);

export default router;