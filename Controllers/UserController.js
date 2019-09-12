const express = require('express');
const router = express.Router();

const userService = require('../Services/UserService');

// TODO: Pasar la lógica a un userService.js, y compartir ese servicio con el que está en middleware.
// TODO Fijate de pasar el usuario a un archivo de configuración.
// TODO: pasar valores a config.

// TODO: plus, fijate en el keep que existe algo para asignar valores por defecto cuando no existe.

router.post('/login', (req, res, next) => {
    
    const {user, password} = req.body;

    const { status, message, response } = userService.getLogin(user, password);

    if (status) {

        res.status(status).json({ message });

    } else {

        res.status(200).json({ response });

    }

});

module.exports = router;