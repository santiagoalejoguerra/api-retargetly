const isoCountry = require('country-list');

const isCountryCodeValid = codeCountry => {

    return Boolean(codeCountry) && isoCountry.getName(codeCountry) !== undefined;
    
}

module.exports = {
    isCountryCodeValid
}