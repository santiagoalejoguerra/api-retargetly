const csv = require('csv');
const countryUtils = require('../Utils/CountryUtils');

const fileService = require('./FileService');
const fileMetricService = require('./FileMetricService');
const segmentFileMetricService = require('./SegmentFileMetricService');
const countrySegmentMetricService = require('./CountrySegmentMetricService');

const process = async (isCreatedRecetly, fileMetricToProcess) => {

    const filename = fileMetricToProcess.name;

    if (isCreatedRecetly) {

        console.log("Starting to process file", filename);

        try {

            await fileMetricService.updateStatusProcessById(fileMetricToProcess.id);

            console.log("Reading file from external. File", filename);

            const fileFromExternal = await fileService.readFileMetricsByName(filename);

            let segments = {};

            console.log("Processing file", filename);

            const segmentsProcessed = await parseFileExternal(fileFromExternal, segments, filename);

            console.log("Finish process succesfully file", filename);

            await saveSegments(filename, segmentsProcessed);

            removeFileFromPathTmp(filename);

            console.log("Update status to finish file", filename);
    
            updateStatusFinishedById(fileMetricToProcess.id);

        } catch (err) {

            updateStatusFailedAndMessage(fileMetricToProcess.id, err.message);

        }

    }

}

const parseFileExternal = (fileFromExternal, segments, filename) => {

    return new Promise((resolve, reject) => {

        try {
        
            fileFromExternal.pipe(
                csv.parse({
                    delimiter: '\t',
                    columns: false,
                    quote: false
                })).on('data', (line, encoding, next) => {
    
                    try {
    
                        const user = line[0];
                        const segmentsString = line[1];
                        const countryCode = line[2];
            
                        const isCodeCountryInvalid = !countryUtils.isCountryCodeValid(countryCode);
            
                        if (isCodeCountryInvalid) {
                            reject({ 
                                message: "Wrong file format" 
                            });
                        }
            
                        const segmentsArray = getSegmentsUnique(segmentsString);
            
                        segmentsArray.forEach(segment => {
            
                            const isNumberSegmentInvalid = !isIntegerPositive(segment);
            
                            if (isNumberSegmentInvalid) {
                                reject({ message: "Wrong file format" });
                            }
            
                            addCountryToSegment(segments, segment, countryCode);
            
                        });
    
    
                    } catch (err) {
    
                        reject({ message: "Problem when processing file" })
    
                    }
        
                }).on("error", err => {

                    console.log("Error when processing file", err);
                    reject({ message: "Wrong file format" });

                }).on('finish', () => {

                    console.log("Finish pipe file", filename);
        
                    resolve(segments);
                        
                });

        } catch (err) {

            console.log("Error when processing file", err);
            reject({ message: "Error when processing file" });
        }

    });

}

const getSegmentsUnique = segmentsString => [...new Set(segmentsString.split(','))]

const addCountryToSegment = (segments, segment, country) => {

    initializeNewArrayIfEmpty(segments, segment);

    const countryIndex = getIndexObjectSegmentByCountry(segments[segment], country);

    postCountryToSegment(countryIndex, segments, segment, country);

}

const removeFileFromPathTmp = filename => fileService.removeFileLocal(filename);

const updateStatusFinishedById = id => {

    fileMetricService.updateStatusFinishedById(id);
    
}

const initializeNewArrayIfEmpty = (segments, segment) => {
    if (!segments[segment]) {
        segments[segment] = []
    }
}

const postCountryToSegment = (countryIndex, segments, segment, country) => {

    const isCountryMetricExists = countryIndex >= 0;

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

        await saveEachSegment(segments, fileMetricSaved);

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

                    await saveEachCountryMetric(segments, segment, segmentSaved);

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
