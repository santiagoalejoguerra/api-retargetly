const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')

const tokens = {};
const SECRET = "SECRETO_PARA_ENCRIPTACION";

router.post('/login', (req, res, next) => {
    
    const {username, password} = req.body;

    const user = {
        'username': username
    }

      console.log(user);

    const token = jwt.sign(user, SECRET, { expiresIn: 15 });

    tokens[token] = user;

    res.json({
        token: token,
    });

});

router.post('/token', (req, res, next) => {

    const { token, username } = req.headers;

    if ((token in tokens) && (tokens[token].username == username)) {

        const user = {
            'username': username
        }

        const token = jwt.sign(user, SECRET, { expiresIn: 15 })

        res.json({
            token: token
        })

    } else {

        res.status(401).json("Unauthorized");

    }

});

module.exports = router;