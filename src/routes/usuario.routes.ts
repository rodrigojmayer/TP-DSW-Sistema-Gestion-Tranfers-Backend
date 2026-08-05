import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';

const router = Router();

router.get('/', UsuarioController.obtenerTodos);
router.post('/', UsuarioController.crear);
router.delete('/:id', UsuarioController.eliminar);

export default router;