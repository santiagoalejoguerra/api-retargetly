const express = require('express');
const router = express.Router();

const fileService = require('../Services/FileService');
const metricService = require('../Services/MetricService');

const ResponseFileList = require('../Dto/ResponseFilesList');

router.get('/list', async (req, next) => {

    const humanreadable = req.query.humanreadable === 'true';

    try {
        
        const files = await fileService.readFiles();
    
        var filesInfoResponse = new ResponseFileList(files, humanreadable);
    
        res.status(200).json({
            response: filesInfoResponse.response()
        });

    } catch (err) {

        next({
            message: err
        });

    }
   
});

router.get('/metrics', async (req, res, next) => {

    const { filename } = req.query;

    isParamEmpty = filename === undefined || filename === '';

    if (isParamEmpty) {
        res.status(400).json({response: "filename param is required"});
        return;
    }
    try {

        console.log(await metricService.getMetricsByFile(filename));

        res.status(200).json("GET File Metrics OK");

    } catch (err) {

        next({
            message: err
        });

    }
    

});

module.exports = router;