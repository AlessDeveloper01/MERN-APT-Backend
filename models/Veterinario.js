import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarID.js";

// | Nombre | Password | Email | Telefono | Web | Token | Confirmado | Crea el Schema de Veterinario
const VeterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

//Hashear los passwords antes de guardarlos
VeterinarioSchema.pre('save', async function(next) {
    // Si un password ya esta hasheado, no lo hashea de nuevo
    if(!this.isModified('password')) {
        next();
    }

    // Hashea el password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compara el password del formulario con el password del usuario registrado
VeterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
   return await bcrypt.compare(passwordFormulario, this.password);
}

// Crea el modelo de Veterinario
const Veterinado = mongoose.model('Veterinario', VeterinarioSchema);

export default Veterinado;