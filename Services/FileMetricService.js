const FileMetric = require('../Schemas/FileMetric');
const fileStatus = require('../Models/FileStatus');

const findOrCreateByFilename = async filename => {

    return await FileMetric.findOrCreate({
        where: {
            name: filename
        }, 
        defaults: {
            startDate: Date.now(),
            status: fileStatus.STARTED
        }
    });

}

module.exports = {
    findOrCreateByFilename
}