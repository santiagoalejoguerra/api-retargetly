const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mySqlService = require('./RemoteServices/MySqlService');
const config = require('config-yml');

const initialConfiguration = require('./Services/InitialConfigurationService');

const api = require('./Routes/index.js');

const port = config.port;

mySqlService
        .authenticate()
        .then(() => {
            console.log('Connection has been established succesfully');

            initialConfiguration.configure();

            app.use(cors());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());

            app.use('/', api);

            app.listen(port, console.log("Listening port", port));

        })
        .catch(err => console.error('Unable to connect to the database: ', err));

mySqlService.sync().then(e => console.log('syncronized!'));