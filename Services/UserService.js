const moment = require('moment');
const jwt = require('jsonwebtoken');

const config = require('config-yml');

const getLogin = (user, password) => {

    if (user !== "Santi" || password !== "123") {

        return { 
            status: 401, 
            message: "username or password not correct"
        };

    } else {

        console.log("INFO - Starting generate token");

        const payload = {
            sub: "1",
            exp: getExpireTime(),
            username: user
        };

        const token = jwt.sign(JSON.stringify(payload), config.auth.secret, { algorithm: config.auth.algorithm });

        const response = {
                token: token,
                expires: formatDate(payload.exp)
            }

        return { response };

    }

}

const getVerify = authorization => {

    if(!authorization){

        console.log("No auth");

        // return res.status(401).json("Unauthentication");

        return {
            status: 401,
            message: "Unauthentication"
        }

    }

    let token = authorization.split(" ")[1];

    console.log("Verifica jwt", token);

    jwt.verify(token, config.auth.secret, {algorithms: config.auth.algorithm}, (err, payload) => {

        if (err){

            console.log("Problem to access", err);

            return {
                status: 401,
                message: "Problem to access"
            }

        } else {
            // Debemos buscar el usuario guardado a la base de datos, usando el sub como id de la entidad de usuario.
            if (payload.sub !== "1") {

                console.log("No exists user in db");

                // return res.status(401).json("You are not allowed to access.");
                return {
                    status: 401,
                    message: "You are not allowed to access"
                }

            } else {

                console.log("Bien, autenticado correctamente!");

                // req.user = { username: "Santi" };

                return {
                    status: undefined
                }

            }

        }
    });

}

const getExpireTime = () => {

    return Math.round(Date.now() / 1000) + parseInt(config.auth.expires);

}

const formatDate = date => {

    return moment.unix(date).format(config.auth.format_custom);

}


module.exports = {
    getLogin,
    getVerify
}