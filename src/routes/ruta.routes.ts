import { Router } from 'express';
import { RutaController } from '../controllers/ruta.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';

const router = Router();

// Crear ruta: Permitido para ADMIN y OPERADOR
router.post(
  '/', 
  autenticarToken, 
  requerirRol(['ADMIN', 'OPERADOR']), 
  RutaController.crear
);

// Consultar rutas: Lectura para cualquier usuario autenticado
router.get('/', RutaController.obtenerTodas);
router.get('/:id', RutaController.obtenerPorId);

// Modificar o eliminar rutas: Permitido para ADMIN y OPERADOR
router.patch(
  '/:id', 
  autenticarToken, 
  requerirRol(['ADMIN', 'OPERADOR']), 
  RutaController.actualizar
);

router.delete(
  '/:id', 
  autenticarToken, 
  requerirRol(['ADMIN', 'OPERADOR']), 
  RutaController.eliminar
);

export default router;