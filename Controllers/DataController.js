const express = require('express');
const router = express.Router();

const personInformationService = require('../Services/PersonalInformationService');

const HttpCodeStatusUtils = require('../Utils/HttpCodeStatusUtils');

const SORTS = ["ASC", "DESC"];
const FIELDS = ["name", "segment1", "segment2", "segment3", "segment4", "platformId", "clientId"];
const LIMIT_DEFAULT = "10";

router.get('/data', async (req, res, next) => {

    try {

        const query = req.query;
        const { sort, sortField } = query;
        const fields = query.fields ? JSON.parse(query.fields) : FIELDS;
        const limit = query.limit || LIMIT_DEFAULT;

        const isInvalidParams =
            isInvalidParamSort(sort) ||
            isInvalidParamSortField(sortField) ||
            isInvalidParamFields(fields) ||
            isInvalidParamLimit(limit);

        if (isInvalidParams) {

            res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_BAD_REQUEST).json("Bad request");

            return;

        }

        const personsInformation = await personInformationService.getByQuery(sort, sortField, fields, Number(limit));

        res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_OK).json({
            response: personsInformation
        });
        
    } catch (err) {

        next({message: err});

    }
 
});

const isInvalidParamSort = sort => !SORTS.includes(sort);

const isInvalidParamSortField = sortField => !FIELDS.includes(sortField);

const isInvalidParamFields = fields => !fields.length > 0 || !fields.every(field => FIELDS.includes(field));

const isInvalidParamLimit = limit => !isIntegerPositive(limit);

const isIntegerPositive = (stringNumber) => {

    const number = Math.floor(Number(stringNumber));

    return number !== Infinity && String(number) === stringNumber && number > 0;

}

module.exports = router;