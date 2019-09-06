var express = require('express');
var router = express.Router();

router.get('/list', (req, res) => {

    // TODO verificar que esté bien así
    const humanreadable = req.query.humanreadable === 'true';

    res.status(200).json({
        response: { humanreadable }
    });
});

router.get('/metrics', (req, res) => {

    const { filename } = req.query;

    isParamEmpty = filename === undefined || filename === '';

    if (isParamEmpty) {
        res.status(400).json({response: "filename param is required"});
        return;
    }

    res.status(200).json("GET File Metrics OK");
});

module.exports = router;