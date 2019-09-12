const express = require('express');
const router = express.Router();

const userService = require('../Services/UserService');

router.use((req, res, next) => {

    const { status, response } = userService.verify(req.headers.authorization);

    isStatusOK = status === 200;

    //if (isStatusOK) {
    if (true) {

        next();

    } else {

        res.status(status).json({ response });

    }

});

module.exports = router;