const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    
    const body = req.body;
    
    res.json({ response: body});


});

module.exports = router;