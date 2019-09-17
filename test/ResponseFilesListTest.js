const { expect } = require('chai');
const ResponseFilesList = require('../Dto/ResponseFilesList');

describe("ResponseFilesList tests:", () => {

    describe("Check response function:", () => {

        it("When it invocked with humanreadable in false, should return object response", () => {

            const files = [{
                name: "test1.tsv",
                size: 1024
            }]

            const humanreadale = false;

            const responseFilesList = new ResponseFilesList(files, humanreadale);

            const response = responseFilesList.response();

            expect(response).to.eqls([{
                name: "test1.tsv",
                size: 1024
            }]);

        });

        it("When it invocked with humanreadable in true with 1KB, should return object response", () => {

            const files = [{
                name: "test1.tsv",
                size: 1024
            }]

            const humanreadale = true;

            const responseFilesList = new ResponseFilesList(files, humanreadale);

            const response = responseFilesList.response();

            expect(response).to.eqls([{
                name: "test1.tsv",
                size: "1.0 KB"
            }]);

        });

        it("When it invocked with humanreadable in true with 1MB, should return object response", () => {

            const files = [{
                name: "test1.tsv",
                size: 1048576
            }]

            const humanreadale = true;

            const responseFilesList = new ResponseFilesList(files, humanreadale);

            const response = responseFilesList.response();

            expect(response).to.eqls([{
                name: "test1.tsv",
                size: "1.0 MB"
            }]);

        });

        it("When it invocked with two files and humanreadable in true with any size, should return object response", () => {

            const files = [{
                name: "test1.tsv",
                size: 1048576
            }, {
                name: "test2.tsv",
                size: 2500
            }, {
                name: "test3.tsv",
                size: 123
            }]

            const humanreadale = true;

            const responseFilesList = new ResponseFilesList(files, humanreadale);

            const response = responseFilesList.response();

            expect(response).to.eqls([{
                name: "test1.tsv",
                size: "1.0 MB"
            }, {
                "name": "test2.tsv",
                "size": "2.4 KB"
            },{
                "name": "test3.tsv",
                "size": "123.0 B"
            }]);

        });

    });
});