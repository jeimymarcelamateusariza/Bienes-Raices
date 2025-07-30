import express from 'express';
const router = express.Router();

// Ruta para la página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.render('auth/register', {
        pagina: 'Crear Cuenta'
    });
});

// Ruta para la página de olvide contraseña
router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', {
        pagina: 'Olvide mi contraseña'
    });
});


export default router; 