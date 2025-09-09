import nodemailer from 'nodemailer';

const emailRegister = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log(datos);
    const { nombre, email, token } = datos;

    //Enviar el email
    await transport.sendMail({
        from: 'Nidum.com',
        to:  email,
        subject: 'Confirma tu cuenta en Nidum',
        text: 'Confirma tu cuenta en Nidum, para empezar a publicar tus propiedades',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Nidum</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace <p>
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000 }/auth/confirmar/${token}">Comprobar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}

export { emailRegister };