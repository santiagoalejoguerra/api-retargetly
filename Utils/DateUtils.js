const moment = require('moment');
const config = require('config-yml');

const formatDateUnix = date => moment.unix(date).format(config.auth.format_custom);

const formatDate = date => moment(date).format(config.auth.format_custom);

module.exports = {
    formatDateUnix,
    formatDate
}