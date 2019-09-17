const { expect } = require('chai');
const dateUtils = require('../Utils/DateUtils');

describe("DateUtils tests:", () => {

    describe("Check formatDateUnix function:", () => {

        it("When it invocked with date unix, should return date formated", () => {

            const dateFormated = dateUtils.formatDateUnix(1568718433.51);

            expect(dateFormated).is.equals('2019-09-17T08:07:13');

        });

    });

    describe("Check formatDate function:", () => {

        it("When it invocked with date, should return date formated", () => {

            const dateFormated = dateUtils.formatDate(1568718433509);

            expect(dateFormated).is.equals('2019-09-17T08:07:13');

        });

    });

});