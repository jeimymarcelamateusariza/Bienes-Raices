import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegister, emailForgotPassword } from '../helpers/email.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', { pagina: 'Iniciar sesión' });
}

const formularioRegister = (req, res) => {
    //console.log(req.csrfToken());
    res.render('auth/register', { 
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
     });
}

const register = async (req, res) => {
    //Validación de campos
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('No es un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener minimo 6 caracteres').run(req);
    await check('password2').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);
    //return res.json(resultado.array());
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/register', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }
    //Extraer los datos
    const { nombre, email, password } = req.body;

    //Verificar que el usuario no este duplicado
    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
        return res.render('auth/register', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    //Almacenar un usuario
    const usuario = await User.create({
        nombre,
        email,
        password,
        token: generarId()
    });

    //Envia el email de confirmación
    emailRegister({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    //Mostrar mensaje de confirmación
    res.render('templates/message', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un correo de confirmación, presiona en el enlace'
    })
}

//Función para comprobar la cuenta
const confirmar = async (req, res, next) => {
    const { token } = req.params;
    //Verificar si el token es valido
    const usuario = await User.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirm-account', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        }
        )
    }
    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.render('auth/confirm-account', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmó correctamente, ya puedes iniciar sesión'
    }
    )

    next();
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/forgot-password', { pagina: 'Olvide mi contraseña', csrfToken: req.csrfToken()});
}

//Función para resetear la contraseña
const resetPassword = async (req, res) => {
    //Validación
    await check('email').isEmail().withMessage('No es un email').run(req);

    let resultado = validationResult(req);
    //return res.json(resultado.array());
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/forgot-password', {
            pagina: 'Olvide mi contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    //Buscar el usuario
    const { email } = req.body;
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
        return res.render('auth/forgot-password', {
            pagina: 'Olvide mi contraseña',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El email no pertenece a ningun usuario' }]
        });
    }

    //Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    //Enviar el email
    emailForgotPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });


    //Mostrar un mensaje
    res.render('templates/message', {
        pagina: 'Restablece tu contraseña',
        mensaje: 'Hemos enviado un correo con las instrucciones.'
    })
}

const comprobarToken = async (req, res) => {
    const { token } = req.params; 
    const usuario = await User.findOne({ where: { token } });
    if (!usuario) {
        return res.render('auth/confirm-account', {
            pagina: 'Reestablece tu contraseña',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }

    //Mostrar formulario para modificar la contraseña
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu contraseña',
        csrfToken: req.csrfToken()
    })
}

const newPassword = async (req, res) => {
    //Validar la nueva contraseña
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener minimo 6 caracteres').run(req);
    let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }
    const { token } = req.params;
    const { password } = req.body;

    //Identificar quien hace el cambio
    const usuario = await User.findOne({ where: { token } });
    //Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();
    res.render('auth/confirm-account', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'La contraseña se guardó correctamente'
    })
    

}



export { formularioLogin, formularioRegister, confirmar, formularioOlvidePassword, register, resetPassword, comprobarToken, newPassword };
