
const s3 = require('./aws-config');

exports.uploadFileToS3 = async function (params) {

    const data = await s3.upload(params).promise();

    return data.Location;

}
