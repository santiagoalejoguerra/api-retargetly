const fileStatus = require('../Models/FileStatus');

class ResponseMetricsFile {
    
    constructor(status, started, finished, metrics) {
        this.status = status;
        this.started = started;
        this.finished = finished;
        this.metrics = metrics;
    }

    constructor(status, message) {
        this.status = status;
        this.message = message;
    }

    response() {
        switch (status) {

            case fileStatus.STARTED:
            case fileStatus.PROCESSING:
                return {
                    "status": fileStatus[status],
                    "started": this.started
                };

            case fileStatus.PROCESSING:
                return {
                    "status": fileStatus[status],
                    "message": this.message
                };

            case fileStatus.FAILED:
                return {
                    "status": fileStatus[status],
                    "started": this.started
                };

            default:
                throw new Error("Other fileStatus is wrong: " + fileStatus);
        }

    }

}