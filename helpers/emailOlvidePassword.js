import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const emailOlvidePassword = async(datos) => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "8546bfa2704a56",
            pass: "9b4a08a3d38527"
        }
    });

    const { email, nombre, token } = datos;
    
    //Enviar email
    const info = await transport.sendMail({
        from: '"APV - Administrador De Pacientes De Veterinaria" <apv@correo.com>',
        to: email,
        subject: 'Solicitaste un cambio de contraseña',
        text: ' Comprueba tu cuenta para cambiar tu contraseña',
        html: `<p class="font-bold text-indigo-600 text-2xl">Hola: ${nombre}, Presiona en el link para recuperar tu acceso</p>
            <p class="font-bold text-indigo-600 text-2xl">Para cambiar la contraseña de tu cuenta, haz click en el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Recuperar Cuenta</a>

            <p class="font-bold text-indigo-600 text-2xl">Si no has creado una cuenta, ignora este email</p>  
        `
    });

    console.log('Mensaje Enviado %s', info.messageId);
}

export default emailOlvidePassword;