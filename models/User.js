import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

// Definición del modelo Usuario
const User = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
}, {
    //Hooks para encriptar la contraseña antes de crear el usuario
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        },
    }
}
);

export default User;