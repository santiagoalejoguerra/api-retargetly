const express = require('express');
const router = express.Router();

const userService = require('../Services/UserService');

router.post('/login', (req, res, next) => {
    
    const {user, password} = req.body;

    const {status, response} = userService.login(user, password);

    const isStatusOK = status === 200;

    if (isStatusOK) {
        
        res.status(200).json({ response });
        return;
        
    } else {

        res.status(status).json({ response });
        return;

    }

});

module.exports = router;