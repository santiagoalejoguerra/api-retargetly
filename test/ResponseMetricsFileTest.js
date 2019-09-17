const { expect } = require('chai');
const ResponseMetricsFile = require('../Dto/ResponseMetricsFile');

const FileStatus = require('../Models/FileStatus');

describe("ResponseMetricsFile tests:", () => {

    describe("Check response function:", () => {

        it("When it invocked with status starting, should return object response", () => {

            const status = "started";
            const startDate = 1568742548162;
            const finishDate = "";
            const message = "";
            const metrics = "";

            const responseMetricsFile = new ResponseMetricsFile({status, startDate, finishDate, message, metrics});

            const response = responseMetricsFile.response();

            expect(response).to.eqls({
                "status": "started",
                "started": "2019-09-17T14:49:08"
            })
            

        });

    });
});