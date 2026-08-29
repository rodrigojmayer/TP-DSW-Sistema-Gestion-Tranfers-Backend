import { Router } from 'express';
import { RutaController } from '../controllers/ruta.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';
import { Rol } from '@prisma/client';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

router.get('/', RutaController.obtenerTodas);
router.get('/:id', RutaController.obtenerPorId);

router.post('/', requerirRol(Rol.ADMIN), RutaController.crear);
router.patch('/:id', requerirRol(Rol.ADMIN), RutaController.actualizar);
router.delete('/:id', requerirRol(Rol.ADMIN), RutaController.eliminar);

export default router;