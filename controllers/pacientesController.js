import Paciente from '../models/Paciente.js';

const agregarPaciente = async(req, res) => {

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteGuardado = await paciente.save();
        res.json(pacienteGuardado);
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }
}

// Obtener todos los pacientes de un veterinario en particular
const obtenerPacientes = async(req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);
}

const obtenerPacienteSingular = async(req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    // Verificar que el paciente exista antes de continuar
    if(!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificar que el veterinario sea el mismo que el que creo el paciente
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'No autorizado' });
    }

    // Verificar que el paciente exista en la base de datos y lo devuelva
        res.json(paciente);
}

const actualizarPaciente = async(req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificar que el veterinario sea el mismo que el que creo el paciente
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'No autorizado' });
    }


    // Actualizar el paciente
    // Si el campo no existe, se mantiene el mismo con el || paciente.nombre
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }
}

const eliminarPaciente = async(req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificar que el veterinario sea el mismo que el que creo el paciente
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'No autorizado' });
    }

    try {
        await paciente.deleteOne();
        res.json({ msg: 'Paciente eliminado' });
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }
}


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPacienteSingular,
    actualizarPaciente,
    eliminarPaciente
}