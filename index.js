const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mySqlService = require('./RemoteServices/MySqlService');
const config = require('config-yml');

const initialConfiguration = require('./Services/InitialConfigurationService');

const api = require('./Routes/index.js');

require('events').EventEmitter.defaultMaxListeners = 15;

const port = config.port;

const init = async () => {

    try {

        await initRemoteConnections();
        await initialConfiguration.configure();

        configApp();
    
    } catch (err) {
    
        console.error('Unable to run app: ', err.message || err);
    
    }

}

const initRemoteConnections = async ()  => {

    await mySqlService.authenticate();
    console.log('Connections has been established succesfully');
    await mySqlService.sync().then(e => console.log('Syncronized!'));

}

const configApp = () => {

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/', api);
    
    app.listen(port, console.log("Listening port", port));
}

init();