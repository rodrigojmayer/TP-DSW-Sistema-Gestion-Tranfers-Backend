import jwt from 'jsonwebtoken';

export class AuthService {
  static async login(identificador: string, passwordPlana: string) {
    const JWT_SECRET = process.env.JWT_SECRET || 'secreto_desarrollo_temp';

    // --- MOCK TEMPORAL PARA BYPASS DE BD ---
    // Simula un usuario válido según el identificador ingresado
    const usuarioSimulado = {
      id: 1,
      usuario: identificador || 'admin',
      email: `${identificador || 'admin'}@test.com`,
      nombre: 'Usuario Dev Mock',
      rol: 'ADMIN', // Puedes cambiarlo a 'OPERADOR', 'CLIENTE' o 'CHOFER' para probar permisos
    };

    // Firmamos un JWT real con los claims que espera tu middleware 'requerirRol'
    const token = jwt.sign(
      { 
        idUsuario: usuarioSimulado.id, 
        rol: usuarioSimulado.rol 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      usuario: usuarioSimulado,
      token
    };
  }
}