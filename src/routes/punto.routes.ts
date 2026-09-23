import { Router } from 'express';
import { PuntoController } from '../controllers/punto.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearPuntoSchema, actualizarPuntoSchema } from '../schemas/punto.schema.js';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
///////////////////////////////////////////////////////////// COMENTADO PARA HACER PRUEBAS
// router.use(autenticarToken);

router.get('/', PuntoController.obtenerTodos);
router.get('/:id', PuntoController.obtenerPorId);

router.post(
  '/',
///////////////////////////////////////////////////////////// COMENTADO PARA HACER PRUEBAS
//  requerirRol('ADMIN'), 
  validarSchema(crearPuntoSchema),
  PuntoController.crear
);

router.patch(
  '/:id',
 // autenticarToken,
  //requerirRol('ADMIN'), 
  validarSchema(actualizarPuntoSchema),
  PuntoController.actualizar
);

router.delete(
  '/:id', 
  // requerirRol('ADMIN'), 
  PuntoController.eliminar
); // ✅ Cambiado de Rol.ADMIN a string plano

export default router;