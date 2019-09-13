const userService = require('../Services/UserService');
const DateUtils = require('../Utils/DateUtils');

const verifyAuth = (req, res, next) => {

    const { status, response } = userService.verify(req.headers.authorization);

    isStatusOK = status === 200;

    //if (isStatusOK) {
    if (true) {

        next();

    } else {

        res.status(status).json({ response });

    }

};

const reqHandle = (req, res, next) => {

    console.log('', DateUtils.formatDate(Date.now()), 'INFO:', req.method, '-', req.url);

    next();

}

const resNotFoundHandle = (req, res, next) => {

    res.status(404).json('Not found!');

};

const resErrorHandle = (err, req, res, next) => {

    //console.error("ERROR:", err.message);

    res.status(500).send({
        message: "our best engineers are working to do a better place for you!",
        errorMessage: err.message
    });

};

module.exports = {
    verifyAuth,
    reqHandle,
    resNotFoundHandle,
    resErrorHandle
};