const express = require('express');
const router = express.Router();

const userService = require('../Services/UserService');

router.use((req, res, next) => {

    console.log("Arriving into Middleware");

    const { status, message } = userService.getVerify(req.headers.authorization);

    if (status) {

        res.status(status).json({ message });

    } else {

        next();

    }

});

module.exports = router;