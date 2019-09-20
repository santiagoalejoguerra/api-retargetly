const jwt = require('jsonwebtoken');
const DateUtils = require('../Utils/DateUtils');
const HttpCodeStatusUils = require('../Utils/HttpCodeStatusUtils');

const config = require('config-yml');

const login = (user, password) => {

    const isErrorAuthenticate = user !== config.auth.user || password !== String(config.auth.password);

    if (isErrorAuthenticate) {

        return {
            status: HttpCodeStatusUils.HTTP_CODE_STATUS_UNAUTHORIZED, 
            response: "username or password not correct"
        };

    } else {
        const payload = {
            exp: getExpireTime(),
            username: user
        };

        const token = jwt.sign(JSON.stringify(payload), config.auth.secret, { algorithm: config.auth.algorithm });

        return {
            status: HttpCodeStatusUils.HTTP_CODE_STATUS_OK, 
            response: {
                token: token,
                expires: DateUtils.formatDateUnix(payload.exp)
            }
        };

    }

}

const verify = authorization => {
    if(!authorization){

        return {
            status: HttpCodeStatusUils.HTTP_CODE_STATUS_UNAUTHORIZED,
            response: "Missing Authorization header."
        }

    }

    let token = authorization.split(" ")[1] || authorization;

    try {

        jwt.verify(token, config.auth.secret, {algorithms: [config.auth.algorithm]});
        
        return {
            status: HttpCodeStatusUils.HTTP_CODE_STATUS_OK
        }

    } catch (err) {

        console.log("Error when verify auth:", err.message);
        
        return {
            status: HttpCodeStatusUils.HTTP_CODE_STATUS_UNAUTHORIZED,
            response: err.message
        }
    }
}

const getExpireTime = () => Math.round(Date.now() / 1000) + parseInt(config.auth.expires);

module.exports = {
    login,
    verify
}