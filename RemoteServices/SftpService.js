const config = require('config-yml').sftp;
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const connect = () => sftp.connect({
    host: config.url,
    username: config.user,
    password: config.password
  });

const getFiles = async () => {

    const data = await connect()
        .then(() => sftp.list(config.path));

    if (data !== null) {

        //console.log(data);

        return data;

    }

}

module.exports = {
    getFiles
}