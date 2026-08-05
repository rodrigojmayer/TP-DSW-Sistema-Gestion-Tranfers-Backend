import express from 'express';
import usuarioRoutes from './routes/usuario.routes.js';

const app = express()
const PORT = process.env["PORT"]
app.use(express.json());

// Montamos las rutas del modulo Usuarios
app.use('/api/usuarios', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});