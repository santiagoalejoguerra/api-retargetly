const fileMetricService = require('./FileMetricService');
const segmentFileMetricService = require('./SegmentFileMetricService');
const processMetricFileService = require('./ProcessMetricFileService');

const FileStatus = require('../Models/FileStatus')

const getMetricsByFile = async file => {

    try {

        const fileMetricNewArray = await fileMetricService.findOrCreateByFilename(file);

        if (fileMetricNewArray) {
            
            const fileMetric = fileMetricNewArray[0];
            const createdRecetly = fileMetricNewArray[1]; 

            processMetricFileService.process(createdRecetly, fileMetric);

            await getMetricReadyFile(fileMetric);

            return fileMetric;

        }

    } catch (err) {

        console.log("ERROR", err);
        throw new Error(err.message);

    }

}

const getMetricReadyFile = async fileMetric => {

    if (FileStatus[fileMetric.status] === FileStatus.READY) {
        
        const segmentsFromDb = await segmentFileMetricService.getSegmentsByIdFileMetric(fileMetric.id);

        if (segmentsFromDb) {

            const result = segmentsFromDb.reduce((result, object) => {

                segmentNumber = object.segmentId;

                (result[object['segmentId']] = result[object['segmentId']] || []).push({
                    country: object.country,
                    count: parseInt(object.count)
                })

                return result;

            }, {});

            const final = [];

            Object.keys(result).forEach(segment => {

                final.push({
                    "segmendId": segment,
                    "Uniques": result[segment]
                })

            });

            fileMetric.metrics = final;

        }
        
    }

}

module.exports = {
    getMetricsByFile
}

