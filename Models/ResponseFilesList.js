function ResponseFilesList(files, humanreadable) {
    this.files = files;
    this.humanreadable = humanreadable;
}

const UNIT_BASE = ['B', 'KB', 'MB', 'GB', 'TB'];
const COUNT_DECIMAL = 1;

ResponseFilesList.prototype.response = function() {
    return this.files.map(file => {
        return {
            "name": file.name,
            "size": this.humanreadable ? getHumanredeableSize(file.size) : file.size
        };
    });

}

const getHumanredeableSize = sizeFile => {

    const unitBase = Math.floor(Math.log(sizeFile) / Math.log(1024));

    return (sizeFile / Math.pow(1024, unitBase)).toFixed(COUNT_DECIMAL) + ' ' + UNIT_BASE[unitBase];

}

module.exports = ResponseFilesList;