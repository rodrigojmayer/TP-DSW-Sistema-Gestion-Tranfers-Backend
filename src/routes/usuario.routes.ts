import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';

const router = Router();

router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.post('/', UsuarioController.crear);
router.delete('/:id', UsuarioController.eliminar);
router.patch('/:id', UsuarioController.actualizar);

export default router;