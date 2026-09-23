import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';

const router = Router();

// Ruta pública para registrarse
router.post(
    '/', 
    UsuarioController.crear
);

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

// Excepción: Si el cliente quiere ver/editar SU PROPIO perfil, se crea un endpoint dedicado
router.get('/me', UsuarioController.obtenerMiPerfil); 
router.patch('/me', UsuarioController.actualizarMiPerfil);

// Solo el ADMIN puede ver la lista o consultar usuarios por ID
router.get(
    '/', 
    requerirRol('ADMIN'), 
    UsuarioController.obtenerTodos
);
router.get(
    '/:id', 
    requerirRol('ADMIN'), 
    UsuarioController.obtenerPorId
);

// Solo el ADMIN puede crear, editar o borrar usuarios
router.post(
    '/', 
    requerirRol('ADMIN'), 
    UsuarioController.crear
);
router.patch(
    '/:id', 
    requerirRol('ADMIN'), 
    UsuarioController.actualizar
);
router.delete(
    '/:id', 
    requerirRol('ADMIN'), 
    UsuarioController.eliminar
);

export default router;