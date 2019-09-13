const FileMetric = require('../Schemas/FileMetric');
const fileService = require('./FileService');
const fileMetricService = require('./FileMetricService')

const getMetricsByFile = async file => {

    // Buscar el registro.
    console.log(await fileMetricService.findOrCreateByFilename(file));

    // Si el registro está
        // Async si el estado es Starting, abro Promise (dentro del promise guadar estado processing)
        // devolver estado
    // fallo

    //fileService.getFile(file);

    return await FileMetric.count();

}

module.exports = {
    getMetricsByFile
}