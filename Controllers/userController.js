var express = require('express');
var router = express.Router();

router.post('/login', (req, res) => {
    res.json("POST Login OK");
});

module.exports = router;