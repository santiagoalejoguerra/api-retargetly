const CountrySegmentMetric = require('../Schemas/CountrySegmentMetric');

const save = async (country, count, idSegment, resolve) => {

    CountrySegmentMetric.create({
        country: country,
        count: count,
        segmentFileMetricId: idSegment
    }).then(() => resolve());

}

const getCountriesByIdSegment = async idSegment => {

    return await CountrySegmentMetric.findAll({
        where: {
            segmentFileMetricId: idSegment
        }
    });

}

module.exports = {
    save,
    getCountriesByIdSegment
}