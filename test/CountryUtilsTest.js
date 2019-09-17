const { expect } = require('chai');
const countryUtils = require('../Utils/CountryUtils');

describe("CountryUtils tests:", () => {

    describe("Check isCountryCodeValid function:", () => {

        it("When code valid, should return true", () => {

            const country = "BR";

            const isValid = countryUtils.isCountryCodeValid(country);

            expect(isValid).is.true;

        });

        it("When code invalid, should return false", () => {

            const country = "ARRR";

            const isValid = countryUtils.isCountryCodeValid(country);

            expect(isValid).is.false;

        });

        it("When code is empty, should return false", () => {

            const country = "";

            const isValid = countryUtils.isCountryCodeValid(country);

            expect(isValid).is.false;

        });

        it("When code is undefined, should return false", () => {

            const country = undefined;

            const isValid = countryUtils.isCountryCodeValid(country);

            expect(isValid).is.false;

        });

        it("When code is null, should return false", () => {

            const country = null;

            const isValid = countryUtils.isCountryCodeValid(country);

            expect(isValid).is.false;

        });

    });
});