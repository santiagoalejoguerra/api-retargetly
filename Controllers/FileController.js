const express = require('express');
const router = express.Router();

const fileService = require('../Services/FileService');
const metricService = require('../Services/MetricService');

const ResponseFileList = require('../Dto/ResponseFilesList');
const ResponseMetricFile = require('../Dto/ResponseMetricsFile');

const HttpCodeStatusUtils = require('../Utils/HttpCodeStatusUtils');

const booleanArrayToValidate = ["true", "false"];

router.get('/list', async (req, res, next) => {

    const humanreadable = req.query.humanreadable;

    const isParamHumanredeableIncorrect = !validateParamHumanredeable(humanreadable);
    const isHumanreadable = getParamHumanredeable(humanreadable);

    if (isParamHumanredeableIncorrect) {
        
        res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_BAD_REQUEST).json({
            code: HttpCodeStatusUtils.HTTP_CODE_STATUS_BAD_REQUEST,
            message: "Parameter humanredeable value must be true or false. By default is false if the parameter is not set."
        });

        return;
    }

    try {
        
        const files = await fileService.readFiles();
    
        var filesInfoResponse = new ResponseFileList(files, isHumanreadable);
    
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

const validateParamHumanredeable = (humanreadable) => {
    return humanreadable === undefined || booleanArrayToValidate.includes(humanreadable);
}

const getParamHumanredeable = (humanreadable) => {
    return humanreadable === 'true' || false;
}


router.get('/metrics', async (req, res, next) => {

    const { filename } = req.query;

    const isParamEmpty = filename === undefined || filename === '';

    if (isParamEmpty) {
        res.status(HttpCodeStatusUtils.HTTP_CODE_STATUS_BAD_REQUEST).json({
            code: HttpCodeStatusUtils.HTTP_CODE_STATUS_BAD_REQUEST,
            message: "filename param is required"
        });
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