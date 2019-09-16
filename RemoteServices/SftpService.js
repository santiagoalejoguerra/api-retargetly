const sftpConfig = require('config-yml').sftp;
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const connect = () => {

    console.log("Connecting to sftp");

    return sftp.connect({
    host: sftpConfig.url,
    username: sftpConfig.user,
    password: sftpConfig.password,
    readyTimeout: sftpConfig.readyTimeout
  });
}

const getFiles = async () => {

    try {
        const data = await connect()
            .then(() => sftp.list(sftpConfig.path));

        if (data) {
            return data;
        }

    } catch (err) {

        throw new Error("Connection problem to SFTP");

    } finally {
        sftp.end();
    }

}

const getFileByFilename = async filename => {

    try {

        const data = await connect()
            .then(() => sftp.get(sftpConfig.path + filename));

        console.log("Got data", data);

        return data;

    } catch (err) {

        throw new Error("Connection problem to SFTP");

    } finally {
        sftp.end();
    }

}

module.exports = {
    getFiles,
    getFileByFilename
}