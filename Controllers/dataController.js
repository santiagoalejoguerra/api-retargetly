var express = require('express');
var router = express.Router();

router.get('/data', (req, res) => {

    const query = req.query;
    const { sort, sortField } = query;
    const fields = JSON.parse(query.fields);
    const limit = query.limit || 10;

    res.json({
        sort,
        sortField,
        fields,
        limit
    });
});

module.exports = router;