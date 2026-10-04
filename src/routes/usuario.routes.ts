import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';

const router = Router();

// Ruta pública para registro inicial
router.post(
    '/', 
    UsuarioController.crear
);

// Middleware de autenticación global para las siguientes rutas
router.use(autenticarToken);

// Endpoints del perfil propio (cualquier usuario autenticado)
router.get('/me', UsuarioController.obtenerMiPerfil); 
router.patch('/me', UsuarioController.actualizarMiPerfil);

// Endpoints exclusivos de ADMIN
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

// Permite al ADMIN actualizar cualquier campo del usuario (incluido 'habilitado')
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