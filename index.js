import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacientesRoutes from './routes/pacientesRoutes.js';

// Crear el servidor
const app = express();

// Habilitar express.json para leer datos del body
app.use(express.json());

// Habilitar dotenv para leer variables de entorno
dotenv.config();

// Conectar a la base de datos
conectarDB();

//Permitir el acceso a la API desde cualquier origen propio (CORS)
const dominiosPermitidos = [
    process.env.FRONTEND_URL
];

// Configurar CORS para permitir el acceso a la plataforma 
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del request está en la lista blanca
            callback(null, true);
        } else {
            callback( new Error('No permitido por CORS') );
        }
    }
}

// Habilitar CORS
app.use(cors( corsOptions ));

// Crea la URL para el router de veterinario
app.use('/api/veterinarios', veterinarioRoutes);

// Crea la URL para el router de veterinario
app.use('/api/pacientes', pacientesRoutes);

// Puerto de la app
const PORT = process.env.PORT || 4001;

// Inicia la app
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});