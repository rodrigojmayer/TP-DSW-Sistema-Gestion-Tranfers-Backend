import express from 'express';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno del .env (para que lea el JWT_SECRET)
dotenv.config();

// Importar rutas existentes
import usuarioRoutes from './routes/usuario.routes.js';
import rutaRoutes from './routes/ruta.routes.js';
import puntoRoutes from './routes/punto.routes.js';

// 2. Importar nuevas rutas de Auth
import authRoutes from './routes/auth.routes.js';

const app = express()
const PORT = process.env["PORT"] || 3000;
app.use(express.json());

// 3. Montar las rutas en la API
app.use('/api/auth', authRoutes); // <-- Habilita POST /api/auth/login
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/puntos', puntoRoutes);
app.use('/api/rutas', rutaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});