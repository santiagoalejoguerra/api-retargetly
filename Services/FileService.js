const fs = require('fs');
const File = require('../Models/File');

const PATH_RESOURCES = "./Resources/files/";

const sftpService = require('../RemoteServices/SftpService');

const readFiles = async () => {

    const files = await sftpService.getFiles();

    let fileInfo;

    const arrayFiles = [];

    if (files !== null) {
    
        files.forEach(file =>  {
            
            fileInfo = new File(file.name, file.size);
    
            arrayFiles.push(fileInfo);
    
        });
    
        console.log(arrayFiles);

    }

    return arrayFiles;

}

const getFiles = () => {
    return fs.readdirSync(PATH_RESOURCES);
}

const getFile = file => fs.statSync(PATH_RESOURCES + file);

module.exports = {
    readFiles
}