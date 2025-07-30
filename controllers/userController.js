const formularioLogin = (req, res) => {
    res.render('auth/login', { pagina: 'Iniciar sesión' });
}

const formularioRegister = (req, res) => {
    res.render('auth/register', { pagina: 'Crear cuenta' });
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/forgot-password', { pagina: 'Olvide mi contraseña' });
}


export { formularioLogin, formularioRegister, formularioOlvidePassword };
