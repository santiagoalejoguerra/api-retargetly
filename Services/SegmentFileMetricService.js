const SegmentFileMetric = require('../Schemas/SegmentFileMetric');

const save = async (segment, idFileMetric) => {

    return await SegmentFileMetric.create({
        number: segment,
        fileMetricId: idFileMetric
    });

}

module.exports = {
    save
}