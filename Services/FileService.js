const fs = require('fs');
const csv = require('csv');

const sftpService = require('../RemoteServices/SftpService');

const File = require('../Models/File');

const PERSONS_INFORMATION_PATH = __dirname + '/../Resources/';
const PERSONS_INFORMATION_FILE = 'personsInformation.csv';

const readFiles = async () => {

    const files = await sftpService.getFiles();

    let fileInfo;

    const arrayFiles = [];

    if (files !== null) {
    
        files.forEach(file =>  {
            
            fileInfo = new File(file.name, file.size);
    
            arrayFiles.push(fileInfo);
    
        });

    }

    return arrayFiles;

}

const readPersonsInformationCsv = async () => {

    const data = await getPersonsInformationPromise();

    if (data !== null ) {

        return data;

    }

    return [];

}

const getPersonsInformationPromise = () => new Promise(resolve => {

    const file = PERSONS_INFORMATION_PATH + PERSONS_INFORMATION_FILE;

    const inputPersonalInformation = fs.createReadStream(file);

    let personsInformationArray = [];

    const parser = csv.parse({
        delimiter: ',',
        columns: true
    }).on('data', (data) => {
        personsInformationArray.push(data);
    }).on('end', () => {
        resolve(personsInformationArray);
    });

    inputPersonalInformation.pipe(parser);

});

module.exports = {
    readFiles,
    getPersonsInformationFromCsv: readPersonsInformationCsv
}