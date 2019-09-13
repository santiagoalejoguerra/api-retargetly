const Sequelize = require('sequelize');
const connection = require('../RemoteServices/MySqlService');

const FileMetric = require('./FileMetric');

const SegmentFileMetric = connection.define('segmentFileMetric', {
    number: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

});

SegmentFileMetric.belongsTo(FileMetric);

module.exports = SegmentFileMetric;