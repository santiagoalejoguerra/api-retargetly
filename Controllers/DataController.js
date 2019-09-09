const express = require('express');
const router = express.Router();

const SORT_VALIDATE = ["asc", "desc"];
const FIELD_VALIDATE = ["name", "segment1", "segment2", "segment3", "segment4", "plataformId", "clientId"];

router.get('/data', (req, res) => {

    const query = req.query;
    const { sort, sortField } = query;
    const fields = JSON.parse(query.fields);
    const limit = Number.parseInt(query.limit || 10);

    const isInvalid = 
        (!SORT_VALIDATE.includes(sort)) ||
        (!FIELD_VALIDATE.includes(sortField)) ||
        (!FIELD_VALIDATE.some(field => !fields.includes(field))) //||
        //!Number.isNan(limit);


    if (isInvalid) {

        res.status(400).json({
            response: "Is invalid"
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

module.exports = router;