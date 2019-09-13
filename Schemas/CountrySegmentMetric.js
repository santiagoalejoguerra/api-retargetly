const Sequelize = require('sequelize');
const connection = require('../RemoteServices/MySqlService');

const SegmentFileMetric = require('./SegmentFileMetricMEtric');

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

CountrySegmentMetric.belongTo(SegmentFileMetric);

module.exports = CountrySegmentMetric;