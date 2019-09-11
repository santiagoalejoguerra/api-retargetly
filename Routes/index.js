const express = require('express');
const api = express.Router();

const middleware = require('../Middleware/index.js');

const userController = require('../Controllers/UserController.js');
const dataController = require('../Controllers/DataController.js');
const fileController = require('../Controllers/FileController.js');

api.use('/', userController);

api.use('/', middleware);

api.use('/', dataController);

api.use('/files', fileController);

module.exports = api;