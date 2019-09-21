const sftpConfig = require('config-yml').sftp;
const Client = require('ssh2').Client;

const DESTINATION_FILE_TMP = __dirname + '/../Resources/files/';

const getFiles = () => new Promise((resolve, reject) => {

    const client = new Client();

    client.on('ready', () => {
        console.log('Client :: ready for list');

        client.sftp((err, sftp) => {

            ifErrReject(err, reject);

            sftp.readdir(sftpConfig.path, (err, list) => {

                ifErrReject(err, reject);

                client.end();

                resolve(list);

            });

        });

    }).connect(connect);

});

const getFileByFilename = async filename => new Promise((resolve, reject) => {

    const client = new Client();

    client.on('ready', () => {
        console.log('Client :: ready for get file', filename);

        client.sftp((err, sftp) => {

            ifErrReject(err, reject);

            const options = {
                concurrency: 64,
                chunkSize: 32768,
                step: (total_transferred, chunk, total) => {
                    process.stdout.write("Downloading file " + filename + ": " + (total_transferred/total)*100 + ' % \r');
                } 
            }

            sftp.fastGet(sftpConfig.path + filename, DESTINATION_FILE_TMP + filename, options, (err) => {

                ifErrReject(err, reject);

                client.end();

                resolve();

            });

        });

    }).connect(connect);

});

const connect = {
    host: sftpConfig.url,
    username: sftpConfig.user,
    password: sftpConfig.password,
    readyTimeout: sftpConfig.readyTimeout
};

module.exports = {
    getFiles,
    getFileByFilename
}

const ifErrReject = (err, reject) => {
    if (err) {
        reject(err);
    }
}
