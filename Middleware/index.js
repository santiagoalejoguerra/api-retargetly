const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')

const SECRET = "SECRETO_PARA_ENCRIPTACION";

router.use((req, res, next) => {

    console.log("entrando a Middleware");

    if(!req.headers.authorization){

        console.log("No tiene autorizacion");

        return next("Missing Authorization header.");

    }

    let token = req.headers.authorization.split(" ")[1];

    console.log("Verifica jwt");

    jwt.verify(token, SECRET, {algorithms: ["HS256"]}, (err, payload) => {

        if (err){

            console.log("Problema para acceder");

            return next(err.message);

        } else {
            // Debemos buscar el usuario guardado a la base de datos, usando el sub como id de la entidad de usuario.
            if (payload.sub !== "1") {

                console.log("No existe usuario en la bd");

                return next("You are not allowed to access.");

            } else {

                console.log("Bien, autenticado correctamente!");

                req.user = { username: "Santi" };

                next();

            }

        }
    });

});

module.exports = router;