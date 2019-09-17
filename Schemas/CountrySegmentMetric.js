const Sequelize = require('sequelize');
const connection = require('../RemoteServices/MySqlService');

const SegmentFileMetric = require('./SegmentFileMetric');

const CountrySegmentMetric = connection.define('countrySegmentMetric', {
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    count: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

CountrySegmentMetric.belongsTo(SegmentFileMetric);

module.exports = CountrySegmentMetric;