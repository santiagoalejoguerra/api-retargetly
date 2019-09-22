const express = require('express');
const router = express.Router();

const userService = require('../Services/UserService');

const HttpCodeStatusUtils = require('../Utils/HttpCodeStatusUtils');

router.post('/login', (req, res) => {
    
    const {user, password} = req.body;

    console.log(user, password);

    const {status, response} = userService.login(user, password);

    const isStatusOK = status === HttpCodeStatusUtils.HTTP_CODE_STATUS_OK;

    if (isStatusOK) {
        
        res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_OK).json({ 
            response 
        });
        
    } else {

        res.status(status).json({ 
            code: status, 
            message: response 
        });

    }

});

module.exports = router;