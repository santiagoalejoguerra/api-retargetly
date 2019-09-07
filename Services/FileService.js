const fs = require('fs');
const File = require('../Models/File');

const PATH_RESOURCES = "./Resources/files/";

const readFiles = () => {

    const files = getFiles();

    let fileInfo;

    const arrayFiles = [];

    files.forEach(file =>  {
        
        fileInfo = new File(file, getSizeByFile(file));

        arrayFiles.push(fileInfo);

    })

    return arrayFiles;

}

const getFiles = () => {
    return fs.readdirSync(PATH_RESOURCES);
}

const getSizeByFile = file => {

    const statFile = getFile(file);

    return statFile.size;

}

const getFile = file => fs.statSync(PATH_RESOURCES + file);

module.exports = {
    readFiles
}