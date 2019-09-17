const CountrySegmentMetric = require('../Schemas/CountrySegmentMetric');

const save = async (country, count, idSegment) => {

    return await CountrySegmentMetric.create({
        country: country,
        count: count,
        segmentFileMetricId: idSegment
    });

}

module.exports = {
    save
}