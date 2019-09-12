const fileService = require('./FileService');
const personalInformationService = require('./PersonalInformationService');

const configure = () => {

    configurePersonalsInformation();

}

const configurePersonalsInformation = async () => {

    const personsInformationArray = await fileService.getPersonsInformationFromCsv();

    if (personsInformationArray) {

        // Es necesario borrar los datos de la tabla para poder
        // insertar los datos cada vez que levanta la app
        // a partir de la lectura del archivo csv.
        // await personalInformationService.destroyAll();

        const count = await personalInformationService.count();

        if (count <= 0) {

            await personalInformationService.saveAll(personsInformationArray);

        }

    }

}

module.exports = {
    configure
}