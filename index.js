const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const api = require('./Routes/index.js');

const port = 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', api);

app.listen(port, console.log("Listening port", port));