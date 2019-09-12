const Sequelize = require('sequelize');
const connection = require('../RemoteServices/MySqlService');

const PersonInformation = connection.define('personInformation', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    segment1: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    segment2: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    segment3: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    segment4: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    platformId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    clientId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

});

module.exports = PersonInformation;