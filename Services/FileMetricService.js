const FileMetric = require('../Schemas/FileMetric');
const SegmentFileMetric = require('../Schemas/SegmentFileMetric')

const FileStatus = require('../Models/FileStatus');

const findOrCreateByFilename = async filename => {

    return await FileMetric.findOrCreate({
        where: {
            name: filename
        }, 
        defaults: {
            startDate: Date.now(),
            status: FileStatus.STARTED
        },
    });

}

const findByFilename = async filename => {

    return await FileMetric.findOne({
        where: {
            name: filename
        }
    });

}

const updateStatusProcessById = async idFileMetric => {

    return await FileMetric.update({
            status: FileStatus.PROCESSING 
        },
        {
            where: {
                id: idFileMetric
            }
        });

}

const updateStatusFailedAndMessageById = async (idFileMetric, message) => {

    return await FileMetric.update({
            status: FileStatus.FAILED,
            message:  message
        },
        {
            where: {
                id: idFileMetric
            }
        });

}

const updateStatusFinishedById = async idFileMetric => {

    return await FileMetric.update({
            status: FileStatus.READY,
            finishDate: Date.now(),
            message: null
        },
        {
            where: {
                id: idFileMetric
            }
        });

}

module.exports = {
    findOrCreateByFilename,
    findByFilename,
    updateStatusProcessById,
    updateStatusFailedAndMessageById,
    updateStatusFinishedById,
}