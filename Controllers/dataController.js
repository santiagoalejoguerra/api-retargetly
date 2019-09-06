var express = require('express');
var router = express.Router();

router.get('/data', (req, res) => {
    res.json("GET Data OK");
});

module.exports = router;