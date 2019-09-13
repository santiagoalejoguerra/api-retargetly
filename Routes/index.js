const express = require('express');
const api = express.Router();

const middleware = require('../Middleware/index.js');

const userController = require('../Controllers/UserController.js');
const dataController = require('../Controllers/DataController.js');
const fileController = require('../Controllers/FileController.js');

api.use('/', middleware.reqHandle);

api.use('/', userController);

api.use('/', middleware.verifyAuth);

api.use('/', dataController);

api.use('/files', fileController);

api.use(middleware.resNotFoundHandle);

api.use(middleware.resErrorHandle);

module.exports = api;