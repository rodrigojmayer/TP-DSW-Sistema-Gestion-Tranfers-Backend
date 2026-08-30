import { Router } from 'express';
import { PuntoController } from '../controllers/punto.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';
import { Rol } from '@prisma/client';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

router.get('/', PuntoController.obtenerTodos);
router.get('/:id', PuntoController.obtenerPorId);

router.post('/', requerirRol(Rol.ADMIN), PuntoController.crear);
router.patch('/:id', requerirRol(Rol.ADMIN), PuntoController.actualizar);
router.delete('/:id', requerirRol(Rol.ADMIN), PuntoController.eliminar);

export default router;