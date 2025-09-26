import express from 'express';
import { formularioLogin, formularioRegister, register, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, newPassword } from '../controllers/userController.js';

const router = express.Router();

// Ruta para la página de inicio de sesión
router.get('/login', formularioLogin);

// Ruta para la página de registro
router.get('/register', formularioRegister);
router.post('/register', register); //Llamada al controlador para registrar un usuario

router.get('/confirmar/:token', confirmar)

// Ruta para la página de olvide contraseña
router.get('/forgot-password', formularioOlvidePassword);
router.post('/forgot-password', resetPassword);

// Almacena la nueva contraseña
router.get('/forgot-password/:token', comprobarToken);
router.post('/forgot-password/:token', newPassword);


export default router; 