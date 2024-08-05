const { PutObjectCommand, DeleteObjectsCommand, S3Client } = require('@aws-sdk/client-s3');

const {AMAZONKEY, AMAZONSECRET, AMAZONREGION, AMAZONBUCKETPHOTOSNAME} = process.env;

const s3 = new S3Client({
    credentials: {
        accessKeyId: AMAZONKEY,
        secretAccessKey: AMAZONSECRET
    },
    region: AMAZONREGION
});

const uploadImageToS3 = async (key, image, mimetype) => {
    const command = new PutObjectCommand({
        Bucket: AMAZONBUCKETPHOTOSNAME,
        Key: key,
        Body: image,
        ContentType: mimetype,
    });

    try {
        await s3.send(command);
        const url = `https://${AMAZONBUCKETPHOTOSNAME}.s3.${AMAZONREGION}.amazonaws.com/${key}`
        return url;
    } catch (err) {
        throw err;
    }
}

const deleteImagesToS3 = async (keys) => {
    const command = new DeleteObjectsCommand({
        Bucket: AMAZONBUCKETPHOTOSNAME,
        Delete: {
            Objects: keys.map(key => ({ Key: key }))
        }
    });

    try {
        await s3.send(command);
        return true;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    uploadImageToS3,
    deleteImagesToS3
};