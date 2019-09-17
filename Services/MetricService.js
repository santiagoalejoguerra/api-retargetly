const csv = require('csv');
const countryUtils = require('../Utils/CountryUtils');

const fileService = require('./FileService');
const fileMetricService = require('./FileMetricService');
const segmentFileMetricService = require('./SegmentFileMetricService');
const countrySegmentMetricService = require('./CountrySegmentMetricService');

const FileStatus = require('../Models/FileStatus')

const getMetricsByFile = async file => {

    // Buscar/crear el registro.
    try {
    
        const fileMetricArray = await fileMetricService.findOrCreateByFilename(file);

        if (fileMetricArray) {

            fileMetric = fileMetricArray[0];
            createdRecetly = fileMetricArray[1]; 

            processFile(createdRecetly, fileMetric);

            getMetricReadyFile(fileMetric);

            return fileMetric;

        }

    } catch (err) {

        console.log("ERROR", err);
        throw new Error(err.message);

    }

}

const processFile = async (isCreatedRecetly, fileMetricToProcess) => {

    if (isCreatedRecetly) {

        console.log("Starting to process file", fileMetricToProcess.name);

        try {

            const fileMetricUpdated = await fileMetricService.updateStatusProcessById(fileMetricToProcess.id);

            if (fileMetricUpdated) {

                console.log("Reading file from external");

                const fileName = fileMetricToProcess.name;

                const fileFromExternal = await fileService.readFileMetricsByName(fileName);

                let segments = {};

                console.log("Processing file", fileName);

                fileFromExternal.pipe(csv.parse({
                    delimiter: '\t',
                    columns: false,
                    quote: false
                }).on('data', line => {
                    
                    const user = line[0];
                    const segmentsString = line[1];
                    const countryCode = line[2];

                    const isCodeCountryInvalid = !countryUtils.isCountryCodeValid(countryCode);

                    if (isCodeCountryInvalid) {

                        throw new Error("Wrong file format.");

                    }

                    segmentsArray = segmentsString.split(',');
                    
                    segmentsArray.forEach(segment => {

                        const isNumberSegmentInvalid = !isIntegerPositive(segment);

                        if (isNumberSegmentInvalid) {

                            throw new Error("Wrong file format.");

                        }

                        addCountryToSegment(segments, segment, countryCode);

                    });
        
                }).on('end', () => {

                    try {
        
                        saveSegments(fileName, segments);

                        updateStatusFinishedById(fileMetricToProcess.id);

                    } catch (err) {

                        console.log(err.message);

                        throw new Error("Processing error.");

                    }
                    
                }));

            }

        } catch (err) {

            updateStatusFailedAndMessage(fileMetricToProcess.id, err.message);

        }

        return;

    }

}

const addCountryToSegment = (segments, segment, country) => {

    initializeNewArrayIfEmpty(segments, segment);
                        
    const countryIndex = getIndexObjectSegmentByCountry(segments[segment], country);

    postCountryToSegment(countryIndex, segments, segment, country);

}

const postCountryToSegment = (countryIndex, segments, segment, country) => {
    isCountryMetricExists = countryIndex >= 0;
    if (isCountryMetricExists) {
        segments[segment][countryIndex].count =
            segments[segment][countryIndex].count + 1;
    }
    else {
        segments[segment].push({
            country: country,
            count: 1
        });
    }
}

const saveSegments = async (fileName, segments) => {

    console.log("Finish process to file", fileName);

    try {

        const fileMetricSaved = await fileMetricService.findByFilename(fileName);

        saveEachSegment(segments, fileMetricSaved);

    } catch (err) {

        console.log("Error when saving fileMetrics", err.message);

        throw new Error(err.message);

    }

}

const saveEachSegment = async (segments, fileMetricSaved) => {

    if (fileMetricSaved) {

        try {

            Object.keys(segments).forEach(async (segment) => {

                const segmentSaved = await segmentFileMetricService.save(segment, fileMetricSaved.id);
    
                saveEachCountryMetric(segments, segment, segmentSaved);
                
            });

        } catch (err) {

            console.log("Error when saving segment metrics", err);

            throw new Error(err.message);

        }

    } else {

        const errorMessage = "File metric not found in db";

        console.log(errorMessage);

        throw new Error(errorMessage);

    }
}
const saveEachCountryMetric = async (segments, segment, segmentSaved) => {

    if (segmentSaved) {

        try {

            segments[segment].forEach(async (countryMetric) => {

                    await countrySegmentMetricService.save(countryMetric.country, countryMetric.count, segmentSaved.id);
                
            });
        
        } catch (err) {

            console.log("Error when saving country metrics:", err);

            throw new Error(err.message);

        }
    }
}

const getMetricReadyFile = fileMetric => {

    if (FileStatus[fileMetric.status] === FileStatus.READY) {
        
        // TODO
        
    }

}

const updateStatusFailedAndMessage = async (id, message) => {

    console.log("Error when processing file: ", message);

    await fileMetricService.updateStatusFailedAndMessageById(id, message);

}

const updateStatusFinishedById = id => {

    fileMetricService.updateStatusFinishedById(id);
    
}

const initializeNewArrayIfEmpty = (segments, segment) => {
    if (!segments[segment]) {
        segments[segment] = []
    }
}

const getIndexObjectSegmentByCountry = (segmentInfo, country) => segmentInfo.findIndex(element => element.country === country);

const isIntegerPositive = (stringNumber) => {

    const number = Math.floor(Number(stringNumber));

    return number !== Infinity && String(number) === stringNumber && number > 0;

}

module.exports = {
    getMetricsByFile,
    addCountryToSegment
}
