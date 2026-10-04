import { Router } from 'express';
import { ViajeController } from '../controllers/viaje.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { validarSchema } from '../middlewares/validarSchema.middleware.js';
import { crearViajeSchema, actualizarViajeSchema } from '../schemas/viaje.schema.js';
import { requerirRol } from '../middlewares/role.middleware.js';

const router = Router();

// 1. RUTAS PÚBLICAS: Accesibles para invitados
router.get('/compartidos', ViajeController.obtenerPublicos); // Solo viajes COMPARTIDOS

// 2. RUTAS PROTEGIDAS: Requieren inicio de sesión (token)
router.get('/mis-viajes', autenticarToken, ViajeController.obtenerParaCliente); // Compartidos + Reservas del cliente
router.get('/admin/todos', autenticarToken, requerirRol(['ADMIN', 'OPERADOR']), ViajeController.obtenerTodos); // Todos los viajes de la DB

// 3. RUTA POR ID (Debe ir después de las rutas específicas como /mis-viajes o /admin/todos)
router.get('/:id', ViajeController.obtenerPorId);

// 4. RUTAS DE ESCRITURA Y EDICIÓN
router.post(
  '/', 
  autenticarToken, 
  requerirRol(['ADMIN', 'OPERADOR']),
  validarSchema(crearViajeSchema), 
  ViajeController.crear
);

router.patch(
  '/:id', 
  autenticarToken, 
  requerirRol(['ADMIN', 'OPERADOR']),
  validarSchema(actualizarViajeSchema), 
  ViajeController.actualizar
);

router.delete(
  '/:id', 
  autenticarToken, 
  requerirRol(['ADMIN', 'OPERADOR']),
  ViajeController.eliminar
);

export default router;