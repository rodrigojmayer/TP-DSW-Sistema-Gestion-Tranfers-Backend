import { Router } from 'express';
import { RutaController } from '../controllers/ruta.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', autenticarToken, requerirRol('ADMIN'), RutaController.crear);
router.get('/', autenticarToken, RutaController.obtenerTodas);
router.get('/:id', autenticarToken, RutaController.obtenerPorId);
router.patch('/:id', autenticarToken, requerirRol('ADMIN'), RutaController.actualizar);
router.delete('/:id', autenticarToken, requerirRol('ADMIN'), RutaController.eliminar);

export default router;