const express = require('express');
const router = express.Router();

const fileService = require('../Services/FileService');

const ResponseFileList = require('../Dto/ResponseFilesList');

router.get('/list', async (req, res) => {

    const humanreadable = req.query.humanreadable === 'true';

    const files = await fileService.readFiles();
    
    var filesInfoResponse = new ResponseFileList(files, humanreadable);

    res.status(200).json({
        response: filesInfoResponse.response()
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