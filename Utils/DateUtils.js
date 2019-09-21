const moment = require('moment');
const config = require('config-yml');

const formatDateUnix = date => moment.unix(date).format(config.format_custom_response);

const formatDate = date => moment(date).format(config.format_custom_response);

module.exports = {
    formatDateUnix,
    formatDate
}