const { expect } = require('chai');
const metricService = require('../Services/MetricService');

describe("MetricService tests:", () => {

    describe("Check addCountryToSegment function:", () => {

        it("When it invocked with empty segments, one segment and one country, should return object segment", () => {

            const segments = [];
            const segment = "132";
            const country = "AR";

            const expectResult = [{
                    country: "AR",
                    count: 1
            }]

            metricService.addCountryToSegment(segments, segment, country);

            expect(segments[segment]).to.eql(expectResult);
            expect(segments).to.have.keys("132");

        });

        it("When it invocked with any segments, same segment exists and same country exists, should return object segment with count 2", () => {

            const segments = [];
            const segment = "132";
            segments[segment] = []
            const country = "AR";

            segments[segment].push({
                country: "AR",
                count: 1
            });

            const expectResult = [{
                    country: "AR",
                    count: 2
            }]

            metricService.addCountryToSegment(segments, segment, country);

            expect(segments[segment]).to.eql(expectResult);
            expect(segments).to.have.keys("132");

        });

        it("When it invocked with any segments, same segment exists and other country exists, should return object segment with count 1 each country", () => {

            const segments = [];
            const segment = "132";
            const country = "BR";

            segments[segment] = []
            segments[segment].push({
                country: "AR",
                count: 1
            });

            const expectResult = [{
                    country: "AR",
                    count: 1
                }, {
                    country: "BR",
                    count: 1
                }]

            metricService.addCountryToSegment(segments, segment, country);

            expect(segments[segment]).to.eql(expectResult);
            expect(segments).to.have.keys("132");

        });

    });

});