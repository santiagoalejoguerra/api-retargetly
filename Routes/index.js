const express = require('express');
const api = express.Router();

const userController = require('../Controllers/userController.js');
const dataController = require('../Controllers/dataController.js');
const fileController = require('../Controllers/fileController.js');

api.use('/', userController);

api.use('/', dataController);

api.use('/files', fileController);

module.exports = api;