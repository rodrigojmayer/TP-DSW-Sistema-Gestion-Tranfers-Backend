import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getEM } from '../lib/db.js';
import { Usuario } from '../entities/Usuario.entity.js';

export class AuthService {
  static async login(identificador: string, passwordPlana: string) {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error('secretOrPrivateKey must have a value');
    }

    const em = getEM();

    // Casteamos el filtro a 'any' para permitir la consulta flexible con $or
    const usuario = await em.findOne(Usuario, {
      $or: [
        { usuario: identificador }
      ]
    } as any);

    // Si no existe el usuario
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Comparamos la contraseña en texto plano con el hash de la BD
    const esPasswordValida = await bcrypt.compare(passwordPlana, usuario.password);

    if (!esPasswordValida) {
      throw new Error('Credenciales inválidas');
    }

    // Generamos el Token JWT firmado (expira en 8 horas)
    const token = jwt.sign(
      { 
        idUsuario: usuario.id, 
        rol: usuario.rol 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Retornamos los datos del usuario (sin el hash) y el token
    const { password, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword,
      token
    };
  }
}