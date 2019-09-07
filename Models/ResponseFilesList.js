class ResponseFilesList {
    
    constructor(files, humanreadable) {
        this.files = files;
        this.humanreadable = humanreadable;
    }

    response() {
        return this.files.map(file => {
            return {
                "name": file.name,
                "size": this.humanreadable ? getHumanredeableSize(file.size) : file.size
            };
        });
    }

}

const UNIT_BASE = ['B', 'KB', 'MB', 'GB', 'TB'];
const COUNT_DECIMAL = 1;


const getHumanredeableSize = sizeFile => {

    const unitBase = Math.floor(Math.log(sizeFile) / Math.log(1024));

    return (sizeFile / Math.pow(1024, unitBase)).toFixed(COUNT_DECIMAL) + ' ' + UNIT_BASE[unitBase];

}

module.exports = ResponseFilesList;