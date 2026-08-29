import { Router } from 'express';
import { RutaController } from '../controllers/ruta.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

router.get('/', RutaController.obtenerTodas);
router.get('/:id', RutaController.obtenerPorId);
router.post('/', RutaController.crear);
router.patch('/:id', RutaController.actualizar);
router.delete('/:id', RutaController.eliminar);

export default router;