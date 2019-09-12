const fileStatus = {
    STARTED: 'started',
    PROCESSING: 'processing',
    FAILED: 'failed',
    READY: 'ready'
}

Object.freeze(fileStatus);

module.exports = fileStatus;