const jwt = require('jsonwebtoken');
const DateUtils = require('../Utils/DateUtils');

const config = require('config-yml');

const login = (user, password) => {

    const isErrorAuthenticate = user !== config.auth.user || password !== String(config.auth.password);

    if (isErrorAuthenticate) {

        return {
            status: 401, 
            response: "username or password not correct"
        };

    } else {
        const payload = {
            exp: getExpireTime(),
            username: user
        };

        const token = jwt.sign(JSON.stringify(payload), config.auth.secret, { algorithm: config.auth.algorithm });

        return {
            status: 200, 
            response: {
                token: token,
                expires: DateUtils.formatDateUnix(payload.exp)
            }
        };

    }

}

const verify = authorization => {
    if(!authorization){
        console.log("No auth");

        return {
            status: 401,
            response: "Missing Authorization header."
        }

    }

    let token = authorization.split(" ")[1] || authorization;

    try {

        jwt.verify(token, config.auth.secret, {algorithms: [config.auth.algorithm]});
        
        return {
            status: 200
        }

    } catch (err) {
        console.log(err.message);

        //throw new Error(err.message);
        
        return {
            status: 401,
            response: err.message
        }
    }
}

const getExpireTime = () => Math.round(Date.now() / 1000) + parseInt(config.auth.expires);

module.exports = {
    login,
    verify
}