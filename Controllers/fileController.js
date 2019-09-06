var express = require('express');
var router = express.Router();

router.get('/list', (req, res) => {
    res.status(200).json("GET File List OK. Hola Pame");
});

router.get('/metrics', (req, res) => {
    res.status(200).json("GET File Metrics OK");
});

module.exports = router;