import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET!;
export class AuthService {
  static async login(identificador: string, passwordPlana: string) {
    // 1. Buscamos al usuario por su email O por su nombre de usuario
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: identificador },
          { usuario: identificador }
        ]
      }
    });

    // Si no existe el usuario
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Comparamos la contraseña en texto plano con el hash de la BD
    const esPasswordValida = await bcrypt.compare(passwordPlana, usuario.password);

    if (!esPasswordValida) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Generamos el Token JWT firmado (expira en 8 horas)
    const token = jwt.sign(
      { 
        idUsuario: usuario.idUsuario, 
        rol: usuario.rol 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 4. Retornamos los datos del usuario (sin el hash) y el token
    const { password, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword,
      token
    };
  }
}