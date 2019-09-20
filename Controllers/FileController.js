//@ts-check
const express = require('express');
const router = express.Router();

const fileService = require('../Services/FileService');
const metricService = require('../Services/MetricService');

const ResponseFileList = require('../Dto/ResponseFilesList');
const ResponseMetricFile = require('../Dto/ResponseMetricsFile');

const HttpCodeStatusUtils = require('../Utils/HttpCodeStatusUtils');

router.get('/list', async (req, res, next) => {

    const humanreadable = req.query.humanreadable === 'true';

    try {
        
        const files = await fileService.readFiles();
    
        var filesInfoResponse = new ResponseFileList(files, humanreadable);
    
        res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_OK).json({
            response: filesInfoResponse.response()
        });

    } catch (err) {

        console.log("Error when get files list:", err.message);

        next({
            message: err.message
        });

    }
   
});

router.get('/metrics', async (req, res, next) => {

    const { filename } = req.query;

    const isParamEmpty = filename === undefined || filename === '';

    if (isParamEmpty) {
        res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_BAD_REQUEST).json({response: "filename param is required"});
        return;
    }
    try {

        const metricsByFile = await metricService.getMetricsByFile(filename);

        if (metricsByFile) {

            const responseMetricsFile = new ResponseMetricFile(metricsByFile);

            res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_OK).json({
                response: responseMetricsFile.response()
            });

        } else {

            next({
                message: "Problem to get metrics by file"
            });

        }
        

    } catch (err) {

        next({
            message: err.message
        });

    }
    

});

module.exports = router;