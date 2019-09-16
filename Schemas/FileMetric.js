const Sequelize = require('sequelize');
const connection = require('../RemoteServices/MySqlService');

const fileStatus = require('../Models/FileStatus');

const FileMetric = connection.define('fileMetric', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM,
        values: Object.keys(fileStatus),
        allowNull: false
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    finishDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: true
    }

});

module.exports = FileMetric;