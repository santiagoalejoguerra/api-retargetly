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

            case fileStatus.FAILED:
                return {
                    "status": fileStatus[status],
                    "message": this.message
                };

<<<<<<< HEAD
=======
            case fileStatus.FAILED:
                return {
                    "status": fileStatus[status],
                    "started": this.started
                };
<<<<<<< HEAD
>>>>>>> ecd462e039613c311f6d4400ec6371e294ef03be
            case fileStatus.READY:
                return {
                    "status": fileStatus[status],
                    "started": this.started,
                    "finished": this.finished,
                    "metrics": this.metrics
                }
<<<<<<< HEAD
=======
=======
>>>>>>> a3f3b04445e160e4fda79a5a693fa0c429e87340
>>>>>>> ecd462e039613c311f6d4400ec6371e294ef03be

            default:
                throw new Error("Other fileStatus is wrong: " + fileStatus);
        }

    }

}