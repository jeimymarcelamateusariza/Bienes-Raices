const formularioLogin = (req, res) => {
    res.render('auth/login');
}

const formularioRegister = (req, res) => {
    res.render('auth/register', { pagina: 'Crear cuenta' });
}


export { formularioLogin, formularioRegister };
