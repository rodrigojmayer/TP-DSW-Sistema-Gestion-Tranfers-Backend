import { Router } from 'express';
import { RutaController } from '../controllers/ruta.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearRutaSchema, actualizarRutaSchema } from '../schemas/ruta.schema.js';
import { Rol } from '@prisma/client';

const router = Router();

router.use(autenticarToken);

router.get('/', RutaController.obtenerTodas);
router.get('/:id', RutaController.obtenerPorId);

// Middleware de roles + Middleware de Zod
router.post(
  '/',
  requerirRol(Rol.ADMIN),
  validarSchema(crearRutaSchema), // Revisa req.body antes del controller
  RutaController.crear
);

router.patch(
  '/:id',
  requerirRol(Rol.ADMIN),
  validarSchema(actualizarRutaSchema), // 👈 Revisa req.body antes del controller
  RutaController.actualizar
);

router.delete('/:id', requerirRol(Rol.ADMIN), RutaController.eliminar);

export default router;