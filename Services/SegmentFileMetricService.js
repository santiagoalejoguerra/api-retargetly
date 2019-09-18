const SegmentFileMetric = require('../Schemas/SegmentFileMetric');

const countrySegmentMetricService = require('../Services/CountrySegmentMetricService');

const save = async (segment, idFileMetric) => {

    return await SegmentFileMetric.create({
        number: segment,
        fileMetricId: idFileMetric
    });

}

const getSegmentsByIdFileMetric = async (idFileMetric) => {

    const segments = await SegmentFileMetric.findAll({
        where: {
            fileMetricId: idFileMetric
        }
    });

    if (segments) {

        const countries = [];

        for (const segment of segments) {

            //console.log(segment.id);

            const countriesMetrics = await countrySegmentMetricService.getCountriesByIdSegment(segment.id);

            for (const countriesMetric of countriesMetrics) {

                countries.push({
                    segmentId: segment.number,
                    country: countriesMetric.country,
                    count: countriesMetric.count
                });

            }
            
        }

        return countries;

    }

}

module.exports = {
    save,
    getSegmentsByIdFileMetric
}