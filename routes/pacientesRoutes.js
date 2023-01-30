import express from 'express';
const router = express.Router();
import { agregarPaciente, obtenerPacientes, obtenerPacienteSingular, actualizarPaciente, eliminarPaciente } from '../controllers/pacientesController.js';
import checkAuth from '../middleware/authMiddleware.js';


router.route('/').post(checkAuth, agregarPaciente).get(checkAuth, obtenerPacientes);

router.route('/:id').get(checkAuth, obtenerPacienteSingular).put(checkAuth, actualizarPaciente).delete(checkAuth, eliminarPaciente);


export default router;