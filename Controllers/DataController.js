const express = require('express');
const router = express.Router();

const personInformationService = require('../Services/PersonalInformationService');

const SORTS = ["ASC", "DESC"];
const FIELDS = ["name", "segment1", "segment2", "segment3", "segment4", "platformId", "clientId"];

router.get('/data', async (req, res) => {

    const query = req.query;
    const { sort, sortField } = query;
    const fields = query.fields ? JSON.parse(query.fields) : FIELDS;
    const limit = query.limit || "10";

    const isInvalidParams =
        isInvalidParamSort(sort) ||
        isInvalidParamSortField(sortField) ||
        isInvalidParamFields(fields) ||
        isInvalidParamLimit(limit);

    if (isInvalidParams) {

        res.status(400).json("Bad request");

        return;

    }

    try {
        const personsInformation = await personInformationService.getByQuery(sort, sortField, fields, Number(limit));

        res.status(200).json({
            response: personsInformation
        });
        
    } catch (err) {

        res.status(500).json("Internal server error");

    }
 
});

const isInvalidParamSort = sort => !SORTS.includes(sort);

const isInvalidParamSortField = sortField => !FIELDS.includes(sortField);

const isInvalidParamFields = fields => !fields.length > 0 || !fields.every(field => FIELDS.includes(field));

const isInvalidParamLimit = limit => !isInteger(limit);

const isInteger = (stringNumber) => {

    const number = Math.floor(Number(stringNumber));

    return number !== Infinity && String(number) === stringNumber && number > 0;

}

module.exports = router;