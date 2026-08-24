import { Router } from 'express';
import { RutaController } from '../controllers/ruta.controller.js';

const router = Router();

router.get('/', RutaController.obtenerTodas);
router.get('/:id', RutaController.obtenerPorId);
router.post('/', RutaController.crear);
router.patch('/:id', RutaController.actualizar);
router.delete('/:id', RutaController.eliminar);

export default router;