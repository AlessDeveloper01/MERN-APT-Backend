import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarID.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

// Registrar un nuevo veterinario
const registrar = async(req, res) => {
    const { email, nombre } = req.body;

    //Prevenir o revisar si ya hay usuarios registrados con el mismo email
    const existeUsuario = await Veterinario.findOne({ email: email })
    if(existeUsuario) {
        const error = new Error('El usuario ya existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        //Guardar a un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar email de confirmacion
        emailRegistro({
            email: email,
            nombre: nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}



// Obtener el perfil de un veterinario registrado
const perfil =  (req, res) => {

    const { veterinario } = req;

    res.json({ veterinario })
}

// Confirmar el registro de un veterinario con el token dinamico
const confirmar = async(req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token: token });
    if(!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({ msg: 'Tu Cuenta Se Confirmo Correctamente, Inicia Sesion!' })
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}




// Crear el login del veterinario
const autenticar = async(req, res) => {
    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email: email });

    if(!usuario) {
        const error = new Error('El Usuario No Se Encuentra Registrado');
        return res.status(403).json({ msg: error.message }); 
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('El Usuario No Ha Sido Confirmado');
        return res.status(403).json({ msg: error.message });
    }

    //Revusar el password si es correcto
    if( await usuario.comprobarPassword(password) ){
        //Autenticar al usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,
            token: generarJWT(usuario.id)
         })
    } else {
        const error = new Error('El Password No Es Correcto');
        return res.status(403).json({ msg: error.message }); 
    }

}


// Recuperar la contraseña de un veterinario
const olvidePassword = async(req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email: email });

    // Comprobar si el usuario existe
    if(!existeVeterinario) {
        const error = new Error('El Usuario No Existe');
        return res.status(400).json({ msg: error.message });
    }

    //Generar el nuevo token de recuperacion
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar email de recuperacion
        emailOlvidePassword({
            nombre: existeVeterinario.nombre,
            email: email,
            token: existeVeterinario.token
        });

        res.json({ msg: 'Hemos enviado a tu bandeja de correo un nuevo Token de recuperacion' })
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}


// Comprobar el token de un veterinario para recuperar la contraseña si es valido
const comprobarToken = async(req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token: token });

    if(tokenValido) {
        // Si el token es valido
        res.json({ msg: 'Token Valido y El Usuario Existe' });

    } else {
        const error = new Error('Token No Valido');
        return res.status(400).json({ msg: error.message });
    }
}


// Cambiar la contraseña de un veterinario si el token es valido
const nuevoPassword = async(req, res) => {
    
    const { token } = req.params; // Token de la url
    const { password } = req.body; // Password del body formulario que rellena el usuario

    const veterinario = await Veterinario.findOne({ token: token });
    if(!veterinario) {
        const error = new Error('Hubo Un Error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Password Actualizado Correctamente' })
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
};

const actualizarPerfil = async(req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error('El Usuario No Existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json({ veterinarioActualizado });
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}


const actualizarPassword = async(req, res) => {

}



export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
}