import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.post('/', UsuarioController.crear);
router.delete('/:id', UsuarioController.eliminar);
router.patch('/:id', UsuarioController.actualizar);

export default router;