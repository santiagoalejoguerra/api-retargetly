// @ts-check
const sftpConfig = require('config-yml').sftp;
const Client = require('ssh2').Client;

const FILE_CHARACTER_SFTP = '-';
const DESTINATION_FILE_TMP = __dirname + '/../Resources/files/';

const connect = () => {

    console.log("Connecting to sftp. Url:", sftpConfig.url,
        "username:", sftpConfig.user, "password:", sftpConfig.password);

    return {
        host: sftpConfig.url,
        username: sftpConfig.user,
        password: sftpConfig.password,
        readyTimeout: sftpConfig.readyTimeout
    };
}

const getFiles = () => new Promise((resolve, reject) => {

    const client = new Client();

    const connect = {
        host: sftpConfig.url,
        username: sftpConfig.user,
        password: sftpConfig.password,
        readyTimeout: sftpConfig.readyTimeout
    };

    client.on('ready', () => {
        console.log('Client :: ready for list');

        client.sftp((err, sftp) => {

            if (err) {
                reject(err);
            }

            sftp.readdir(sftpConfig.path, (err, list) => {

                if (err) {
                    reject(err);
                }

                client.end();

                resolve(list);

            });

        });

    }).connect(connect);

});

const getFileByFilename = async filename => new Promise((resolve, reject) => {

    const client = new Client();

    const connect = {
        host: sftpConfig.url,
        username: sftpConfig.user,
        password: sftpConfig.password,
        readyTimeout: sftpConfig.readyTimeout
    };

    client.on('ready', () => {
        console.log('Client :: ready for get file', filename);

        client.sftp((err, sftp) => {

            if (err) {
                reject(err);
            }

            const options = {
                concurrency: 64,
                chunkSize: 32768,
                step: (total_transferred, chunk, total) => {
                    console.log("Downloading file", filename, ":", (total_transferred/total)*100 + ' %');
                } 
            }

            sftp.fastGet(sftpConfig.path + filename, DESTINATION_FILE_TMP + filename, options, (err) => {

                if (err) {
                    reject(err);
                }

                client.end();

                console.log("EXITO", filename);

                resolve();

            });

        });

    }).connect(connect);

});



const das = {

    // try {

    //     let isExistsFile = await connect()
    //         .then(() => sftp.exists(sftpConfig.path + filename));

    //     isExistsFile = isExistsFile === FILE_CHARACTER_SFTP;

    //     if (isExistsFile) {

    //         options = {
    //             concurrency: 64,
    //             chunkSize: 32768,
    //             step: (total_transferred, chunk, total) => {
    //                 console.log("Downloading file", filename, ":", (total_transferred/total)*100 + ' %');
    //             } 
    //         }

    //         const downloadData = await connect()
    //         .then(() => sftp.fastGet(sftpConfig.path + filename, DESTINATION_FILE_TMP + filename, options));

    //         console.log("Got data", downloadData);

    //     } else {

    //         throw new Error("File not found");

    //     }

    // } catch (err) {

    //     throw new Error(err.message);

    // } finally {
    //     sftp.end();
    // }

}

module.exports = {
    getFiles,
    getFileByFilename
}