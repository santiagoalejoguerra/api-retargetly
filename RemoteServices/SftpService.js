const sftpConfig = require('config-yml').sftp;
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const connect = () => sftp.connect({
    host: sftpConfig.url,
    username: sftpConfig.user,
    password: sftpConfig.password
  });

const getFiles = async () => {

    try {
        const data = await connect()
            .then(() => sftp.list(sftpConfig.path));

        if (data !== null) {
            return data;
        }

    } finally {
        sftp.end();
    }

}

module.exports = {
    getFiles
}