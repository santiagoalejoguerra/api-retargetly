const userService = require('../Services/UserService');
const DateUtils = require('../Utils/DateUtils');
const HttpCodeStatusUtils = require('../Utils/HttpCodeStatusUtils');

const reqHandle = (req, res, next) => {

    console.log('--->', DateUtils.formatDate(Date.now()), 'INFO:', req.method, '-', req.url);

    next();

}

const verifyAuth = (req, res, next) => {

    const { status, response } = userService.verify(req.headers.authorization);

    isStatusOK = status === HttpCodeStatusUtils.HTTP_CODE_STATUS_OK;

    if (isStatusOK) {

        next();

    } else {

        res.status(status).json({ code: status, response });

    }

};

const resNotFoundHandle = (req, res, next) => {

    console.log("Not found");

    res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_NOT_FOUND).json({
        code: HttpCodeStatusUtils.HTTP_CODE_STATUS_NOT_FOUND,
        message: 'Not found!'
    });

};

const resErrorHandle = (err, req, res, next) => {

    console.log("Error internal");

    res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_ERROR_INTERNAL).send({
        code: HttpCodeStatusUtils.HTTP_CODE_STATUS_ERROR_INTERNAL,
        message: "our best engineers are working to do a better place for you!",
        errorMessage: err.message
    });

};

module.exports = {
    reqHandle,
    verifyAuth,
    resNotFoundHandle,
    resErrorHandle
};