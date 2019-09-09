const express = require('express');
const router = express.Router();

const SORTS = ["asc", "desc"];
const FIELDS = ["name", "segment1", "segment2", "segment3", "segment4", "plataformId", "clientId"];

router.get('/data', (req, res) => {

    const query = req.query;
    const { sort, sortField } = query;
    const fields = query.fields ? JSON.parse(query.fields) : FIELDS;
    const limit = query.limit || "10";

    const isInvalid =
        isInvalidParamSort(sort) ||
        isInvalidParamSortField(sortField) ||
        isInvalidParamFields(fields) ||
        isInvalidParamLimit(limit);

    if (isInvalid) {

        res.status(400).json({
            response: "Bad request"
        })

    } else {

        res.json({
            sort,
            sortField,
            fields,
            limit
        });

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