const csv = require('csv');
const isoCountry = require('iso-3166-2');

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
                    const country = line[2];

                    segmentsArray = segmentsString.split(',');
                    
                    segmentsArray.forEach(segment => {

                        addCountryToSegment(segments, segment, country);

                    });
        
                }).on('end', () => {
        
                    saveSegments(fileName, segments);

                    updateStatusFinishedById(fileMetricToProcess.id);
                    
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

    isCountryExists = countryIndex >= 0;

    if (isCountryExists) {
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
    //console.log(Object.keys(segments));

    const fileMetricSaved = await fileMetricService.findByFilename(fileName);

    if (fileMetricSaved) {

        Object.keys(segments).forEach(async segment => {

            const segmentSaved = await segmentFileMetricService.save(segment, fileMetricSaved.id);

            if (segmentSaved) {

                segments[segment].forEach(async countryMetric => {

                    console.log(countryMetric.country, countryMetric.count, segmentSaved.id);

                    try {

                        await countrySegmentMetricService.save(countryMetric.country, countryMetric.count, segmentSaved.id);

                    } catch (err) {
                        console.log(err);
                    }
                    

                })
                

            }
            

        })

    }

}

const getMetricReadyFile = fileMetric => {

    if (FileStatus[fileMetric.status] === FileStatus.READY) {
        
        const 
        
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

module.exports = {
    getMetricsByFile,
    addCountryToSegment
}