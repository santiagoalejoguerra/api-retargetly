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

const NAME_UNIT_BASE = ['B', 'KB', 'MB', 'GB', 'TB'];
const MAX_COUNT_DECIMAL = 1;

const getHumanredeableSize = sizeFile => {

    const unitBase = Math.floor(Math.log(sizeFile) / Math.log(1024));

    return (sizeFile / Math.pow(1024, unitBase)).toFixed(MAX_COUNT_DECIMAL) + ' ' + NAME_UNIT_BASE[unitBase];

}

module.exports = ResponseFilesList;