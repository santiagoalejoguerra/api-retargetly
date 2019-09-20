const csv = require('csv');
const countryUtils = require('../Utils/CountryUtils');

const fileService = require('./FileService');
const fileMetricService = require('./FileMetricService');
const segmentFileMetricService = require('./SegmentFileMetricService');
const countrySegmentMetricService = require('./CountrySegmentMetricService');

const process = async (isCreatedRecetly, fileMetricToProcess) => {

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

                await parseFileExternal(fileFromExternal, segments, fileName, fileMetricToProcess);

            } else {

                throw new Error("Problem when update status metric to processing");

            }

        } catch (err) {

            updateStatusFailedAndMessage(fileMetricToProcess.id, err.message);

        }

    }

}

const parseFileExternal = (fileFromExternal, segments, fileName, fileMetricToProcess) => {

    return new Promise((resolve, reject) => {

        fileFromExternal.on('error', async err => {
            console.log(err);
            //await updateStatusFailedAndMessage(fileMetricToProcess.id, err);
            reject(err);
        })
    
        fileFromExternal.pipe(
            csv.parse({
                delimiter: '\t',
                columns: false,
                quote: false
            })).on('data', (line, encoding, next) => {
    
                const user = line[0];
                const segmentsString = line[1];
                const countryCode = line[2];
    
                const isCodeCountryInvalid = !countryUtils.isCountryCodeValid(countryCode);
    
                if (isCodeCountryInvalid) {
                    fileFromExternal.emit("error", { message: "Wrong file format" });
                }
    
                segmentsArray = segmentsString.split(',');
    
                segmentsArray.forEach(segment => {
    
                    const isNumberSegmentInvalid = !isIntegerPositive(segment);
    
                    if (isNumberSegmentInvalid) {
                        fileFromExternal.emit("error", { message: "Wrong file format" });
                    }
    
                    addCountryToSegment(segments, segment, countryCode);
    
                });
            }).on('end', () => {
    
                try {
    
                    saveSegments(fileName, segments);
    
                    updateStatusFinishedById(fileMetricToProcess.id);
                    
                } catch (err) {
                    fileFromExternal.emit("error", err);
                }
            });

    });

}

const addCountryToSegment = (segments, segment, country) => {

    initializeNewArrayIfEmpty(segments, segment);
                        
    const countryIndex = getIndexObjectSegmentByCountry(segments[segment], country);

    postCountryToSegment(countryIndex, segments, segment, country);

}

const updateStatusFinishedById = id => {

    fileMetricService.updateStatusFinishedById(id);
    
}

const initializeNewArrayIfEmpty = (segments, segment) => {
    if (!segments[segment]) {
        segments[segment] = []
    }
}

const postCountryToSegment = (countryIndex, segments, segment, country) => {

    isCountryMetricExists = countryIndex >= 0;

    if (isCountryMetricExists) {

        segments[segment][countryIndex].count =
            segments[segment][countryIndex].count + 1;

    } else {

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

                try {

                    const segmentSaved = await segmentFileMetricService.save(segment, fileMetricSaved.id);

                    saveEachCountryMetric(segments, segment, segmentSaved);

                } catch(err) {

                    console.log(err);

                    throw err;

                }
                
                
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

const updateStatusFailedAndMessage = async (id, message) => {

    console.log("Error when processing file: ", message);

    await fileMetricService.updateStatusFailedAndMessageById(id, message);

}

const getIndexObjectSegmentByCountry = (segmentInfo, country) => segmentInfo.findIndex(element => element.country === country);

const isIntegerPositive = (stringNumber) => {

    const number = Math.floor(Number(stringNumber));

    return number !== Infinity && String(number) === stringNumber && number > 0;

}

module.exports = {
    process,
    addCountryToSegment
}