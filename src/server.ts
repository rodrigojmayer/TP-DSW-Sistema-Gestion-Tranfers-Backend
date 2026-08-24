import express from 'express';
import usuarioRoutes from './routes/usuario.routes.js';
import puntoRoutes from './routes/punto.routes.js';
import rutaRoutes from './routes/ruta.routes.js';

const app = express()
const PORT = process.env["PORT"]
app.use(express.json());

// Montamos las rutas del modulo Usuarios
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/puntos', puntoRoutes);
app.use('/api/rutas', rutaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});