const fs = require('fs');
const csv = require('csv');

const sftpService = require('../RemoteServices/SftpService');

const File = require('../Models/File');

const PERSONS_INFORMATION_PATH = __dirname + '/../Resources/';
const PERSONS_INFORMATION_FILE = 'personsInformation.csv';

const FILES_INFORMATION_PATH = __dirname + '/../Resources/files/';


const readFiles = async () => {

    try {

        const files = await sftpService.getFiles();

        const arrayFiles = [];

        files.forEach(file => addFileToArray(file, arrayFiles));

        return arrayFiles;

    } catch (err) {

        throw err;

    }

}

const addFileToArray = (file, arrayFiles) => arrayFiles.push(new File(file.filename, file.attrs.size));

const readPersonsInformationCsv = async () => {

    const data = await getPersonsInformationPromise();

    if (data !== null) {

        return data;

    }

    return [];

}

const getPersonsInformationPromise = () => new Promise(resolve => {

    const file = PERSONS_INFORMATION_PATH + PERSONS_INFORMATION_FILE;

    const inputPersonalInformation = fs.createReadStream(file);

    let personsInformationArray = [];

    inputPersonalInformation.pipe(csv.parse({
        delimiter: ',',
        columns: true
    })).on('data', (data) => {
        personsInformationArray.push(data);
    }).on('end', () => {
        resolve(personsInformationArray);
    });

});

const readFileMetricsByName = async filename => {

    try {

        await sftpService.getFileByFilename(filename);

        const file = fs.createReadStream(FILES_INFORMATION_PATH + filename);

        return file;

    } catch (err) {

        console.log("Error when read file: " + err.message);

        throw new Error(err.message);

    }

}

const removeFileLocal = filename => {
    fs.unlink(FILES_INFORMATION_PATH + filename, () => console.log("Removed file", filename));
}

module.exports = {
    readFiles,
    getPersonsInformationFromCsv: readPersonsInformationCsv,
    readFileMetricsByName,
    removeFileLocal
}