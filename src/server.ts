import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// 1. Cargar variables de entorno del .env
dotenv.config();

// Importar inicializador de MikroORM
import { initORM } from './lib/db.js';

// Importar rutas
import usuarioRoutes from './routes/usuario.routes.js';
import rutaRoutes from './routes/ruta.routes.js';
import puntoRoutes from './routes/punto.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env['PORT'] || 3000;
const CLIENT_URL = process.env['CLIENT_URL'] || 'http://localhost:5173';

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
cors({
origin: CLIENT_URL,
credentials: true,
})
);

app.use(express.json());

// Montar las rutas en la API
app.use('/api/auth', authRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/punto', puntoRoutes);
app.use('/api/ruta', rutaRoutes);

// Función de arranque que conecta la DB y levanta el servidor
async function bootstrap() {
await initORM();
}

bootstrap().catch((err) => {
console.error('❌ Error al iniciar el servidor:', err);
});