import express from 'express';
const router = express.Router();

// Ruta para la página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
});

// Ruta para la página de registro
router.get('/registro', (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    });
});

export default router; 