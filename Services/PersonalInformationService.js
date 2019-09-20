const PersonInformation = require('../Schemas/PersonInformation');

const save = async personInformation => {

    const personInformationCreated = await PersonInformation.create(personInformation);

    return personInformationCreated;

}

const saveAll = async personsInformationArray => {

    PersonInformation.bulkCreate(personsInformationArray)
    .then(() => count())
    .then((data) => {
        console.log("Inserted personsInformation count:", data);
    });

}

const getByQuery = async (sort, sortField, fields, limit) => {

    const personsInformation = 
        await PersonInformation.findAll({
            order: [[sortField, sort]],
            limit,
            attributes: fields
        });

    return personsInformation;

}

const destroyAll = async () => {
    await PersonInformation.destroy({
        where: {},
        truncate: true
    });
    console.log("Destroyed all personInformations");
}

const count = async () => {
    return await PersonInformation.count();
}

module.exports = {
    save,
    saveAll,
    getByQuery,
    destroyAll,
    count
}