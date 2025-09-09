import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegister } from '../helpers/email.js';

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
    res.render('auth/forgot-password', { pagina: 'Olvide mi contraseña' });
}


export { formularioLogin, formularioRegister, confirmar, formularioOlvidePassword, register };
