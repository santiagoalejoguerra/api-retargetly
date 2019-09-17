const sftpConfig = require('config-yml').sftp;
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const FILE_CHARACTER_SFTP = '-';
const DESTINATION_FILE_TMP = __dirname + '/../Resources/files/';

const connect = () => {

    console.log("Connecting to sftp. Url:", sftpConfig.url,
        "username:", sftpConfig.user, "password:", sftpConfig.password);

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

        throw new Error("Connection problem to SFTP.", err);

    } finally {
        sftp.end();
    }

}

const getFileByFilename = async filename => {

    try {

        let isExistsFile = await connect()
            .then(() => sftp.exists(sftpConfig.path + filename));

        isExistsFile = isExistsFile === FILE_CHARACTER_SFTP;

        if (isExistsFile) {

            options = {
                concurrency: 64,
                chunkSize: 32768,
                step: (total_transferred, chunk, total) => {
                    console.log("Downloading file", filename, ":", (total_transferred/total)*100 + ' %');
                } 
            }

            const downloadData = await connect()
            .then(() => sftp.fastGet(sftpConfig.path + filename, DESTINATION_FILE_TMP + filename, options));

            console.log("Got data", downloadData);

        } else {

            throw new Error("File not found");

        }

    } catch (err) {

        throw new Error(err.message);

    } finally {
        sftp.end();
    }

}

module.exports = {
    getFiles,
    getFileByFilename
}