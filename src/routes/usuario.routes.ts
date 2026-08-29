import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';
import { requerirRol } from '../middlewares/role.middleware.js';
import { Rol } from '@prisma/client';

const router = Router();

// Aplica autenticación a TODAS las rutas de abajo
router.use(autenticarToken);

// Excepción: Si el cliente quiere ver/editar SU PROPIO perfil, se crea un endpoint dedicado
router.get('/me', UsuarioController.obtenerMiPerfil); // Lee el ID desde req.usuario.idUsuario
router.patch('/me', UsuarioController.actualizarMiPerfil);

// Solo el ADMIN puede ver la lista o consultar usuarios por ID
router.get('/', requerirRol(Rol.ADMIN), UsuarioController.obtenerTodos);
router.get('/:id', requerirRol(Rol.ADMIN), UsuarioController.obtenerPorId);

// Solo el ADMIN puede crear, editar o borrar usuarios
router.post('/', requerirRol(Rol.ADMIN), UsuarioController.crear);
router.patch('/:id', requerirRol(Rol.ADMIN), UsuarioController.actualizar);
router.delete('/:id', requerirRol(Rol.ADMIN), UsuarioController.eliminar);

export default router;