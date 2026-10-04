import { Router } from 'express';
import { PuntoController } from '../controllers/punto.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearPuntoSchema, actualizarPuntoSchema } from '../schemas/punto.schema.js';

const router = Router();

// 1. RUTAS PÚBLICAS: Cualquiera puede listar puntos
router.get('/', PuntoController.obtenerTodos);
router.get('/:id', PuntoController.obtenerPorId);

// 2. RUTAS PROTEGIDAS: Permitir acceso a ADMIN y OPERADOR
router.post(
  '/',
  autenticarToken,
  requerirRol(['ADMIN', 'OPERADOR']), // 👈 Permitir ambos roles
  validarSchema(crearPuntoSchema),
  PuntoController.crear
);

router.patch(
  '/:id',
  autenticarToken,
  requerirRol(['ADMIN', 'OPERADOR']), // 👈 Permitir ambos roles
  validarSchema(actualizarPuntoSchema),
  PuntoController.actualizar
);

router.delete(
  '/:id',
  autenticarToken,
  requerirRol(['ADMIN', 'OPERADOR']), // 👈 Permitir ambos roles
  PuntoController.eliminar
);

export default router;