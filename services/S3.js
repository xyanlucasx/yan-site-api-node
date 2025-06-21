const { PutObjectCommand, DeleteObjectsCommand, S3Client } = require('@aws-sdk/client-s3');

const {BUCKET_KEY, BUCKET_SECRET, BUCKET_REGION, BUCKET_NAME, BUCKET_API} = process.env;

const s3 = new S3Client({
    credentials: {
        accessKeyId: BUCKET_KEY,
        secretAccessKey: BUCKET_SECRET
    },
    region: BUCKET_REGION,
    endpoint: BUCKET_API
});

const uploadImageToS3 = async (key, image, mimetype) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: image,
        ContentType: mimetype,
    });

    try {
        await s3.send(command);
        return key;
    } catch (err) {
        throw err;
    }
}

const deleteImagesToS3 = async (keys) => {
    const command = new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
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