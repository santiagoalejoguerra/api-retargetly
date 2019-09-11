const express = require('express');
const router = express.Router();
const config = require('config-yml');

const jwt = require('jsonwebtoken');
const moment = require('moment');

const tokens = {};
const SECRET = "SECRETO_PARA_ENCRIPTACION";
const FORMAT_CUSTOM = "YYYY-MM-DDTHH:mm:ss";

// TODO: Pasar la lógica a un userService.js, y compartir ese servicio con el que está en middleware.
// TODO Fijate de pasar el usuario a un archivo de configuración.
// TODO: pasar valores a config.

// TODO: plus, fijate en el keep que existe algo para asignar valores por defecto cuando no existe.

router.post('/login', (req, res, next) => {
    
    const {user, password} = req.body;

    if (user !== "Santi" || password !== "123") {

        next("username or password not correct");

    } else {

        console.log("Comenzamos la generacion de token");

        const payload = {
            sub: "1",
            exp: getExpireTime(),
            username: user
        };

        // const token = jwt.sign(JSON.stringify(payload), SECRET, { algorithm: "HS256"});
        const token = jwt.sign(JSON.stringify(payload), config.auth.secret, { algorithm: config.auth.algorithm });

        res.json({
            response: {
                token: token,
                expires: formatDate(payload.exp)
            }
        });

    }

});

const getExpireTime = () => {

    return Math.round(Date.now() / 1000) + parseInt(config.auth.expires); // expires 20 = 20 segundos

}

const formatDate = date => {

    // return moment.unix(date).format(FORMAT_CUSTOM);
    return moment.unix(date).format(config.auth.format_custom);

}

module.exports = router;