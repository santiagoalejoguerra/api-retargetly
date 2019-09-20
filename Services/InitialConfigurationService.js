const fileService = require('./FileService');
const personalInformationService = require('./PersonalInformationService');

const configure = async () => {

    await configurePersonalsInformation();

}

const configurePersonalsInformation = async () => {

    if (await personalInformationService.count() <= 0) {

        const personsInformationFromFile = await fileService.getPersonsInformationFromCsv();

        // await personalInformationService.destroyAll();
        await personalInformationService.saveAll(personsInformationFromFile);

    }

}

module.exports = {
    configure
}