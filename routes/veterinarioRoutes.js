import express from "express";
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

// Crea el router de Veterinario
const router = express.Router();

// Router pára registrar un veterinario
router.post('/', registrar);

// Router para confirmar el registro de un veterinario, con el token dinamico
router.get('/confirmar/:token', confirmar);

// Router para autenticar un veterinario por medio de un POST
router.post('/login', autenticar);

// Router para recuperar la contraseña de un veterinario
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


// Router para obtener el perfil de un veterinario
router.get('/perfil', checkAuth, perfil); // Area Privada
router.put('/perfil:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;