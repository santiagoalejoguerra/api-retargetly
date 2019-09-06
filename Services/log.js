var winston = require('winston');

const jsonFormatter = (logEntry) => {
    if (logEntry.type) {
        const base = {
            timestamp: new Date()
        };
        const json = Object.assign(base, logEntry);
        logEntry[MESSAGE] = JSON.stringify(json);
    } else {
        logEntry = "";
    }

    return logEntry;
}

var logger = winston.createLogger({
  format: winston.format(jsonFormatter)(),
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true,  }),
    //new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    //new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;