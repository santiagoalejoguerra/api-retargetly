const PersonInformation = require('../Models/PersonInformation');

const save = async personInformation => {

    const personInformationCreated = await PersonInformation.create(personInformation);

    return personInformationCreated;

}

const saveAll = async personsInformationArray => {

    PersonInformation.bulkCreate(personsInformationArray)
    .then(() => PersonInformation.count())
    .then((data) => {
        console.log("Insert personsInformation count:", data);
    });

}

const destroyAll = async () => {
    await PersonInformation.destroy({
        where: {},
        truncate: true
    });
}

module.exports = {
    save,
    saveAll,
    destroyAll
}