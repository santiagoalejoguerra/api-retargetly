const FileStatus = require('../Models/FileStatus');
const DateUtils = require('../Utils/DateUtils');

class ResponseMetricsFile {
    
    constructor({status, startDate, finishDate, message, metrics}) {
        this.status = status;
        this.started = startDate;
        this.finished = finishDate;
        this.metrics = metrics;
        this.message = message;
    }

    response() {

        const getFileStatus = FileStatus[this.status] || this.status;

        switch (getFileStatus || this.status) {
            case FileStatus.STARTED:
            case FileStatus.PROCESSING:
                return {
                    "status": getFileStatus,
                    "started": getFormatDate(this.started)
                };

            case FileStatus.FAILED:
                return {
                    "status": getFileStatus,
                    "message": this.message
                };

            case FileStatus.READY:
                return {
                    "status": getFileStatus,
                    "started": getFormatDate(this.started),
                    "finished": getFormatDate(this.finished),
                    "metrics": this.metrics
                }

            default:
                throw new Error("Other fileStatus is wrong: " + getFileStatus);
        }
    }

}


getFormatDate = date => {
    return DateUtils.formatDate(date);
}

module.exports = ResponseMetricsFile;