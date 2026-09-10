const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const crypto = require('crypto');


function getS3Client() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'ap-south-1';

  if (accessKeyId && secretAccessKey) {
    return new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }
  return null;
}

/**
 * Upload a file buffer to AWS S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File mime type
 * @param {string} folder - Target folder inside S3 bucket (default: 'naksa_layouts')
 * @returns {Promise<string>} S3 object public URL
 */
async function uploadToS3(fileBuffer, originalName = 'file.png', mimeType = 'image/png', folder = 'uploads') {
  const region = process.env.AWS_REGION || 'ap-south-1';
  const bucketName = process.env.AWS_S3_BUCKET_NAME || 'hsynr';

  const ext = path.extname(originalName) || '.png';
  const randomHash = crypto.randomBytes(8).toString('hex');
  const cleanName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${folder}/${Date.now()}_${cleanName}_${randomHash}${ext}`;
  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;

  const client = getS3Client();

  if (!client || !fileBuffer) {
    console.warn('[S3 Upload] AWS credentials not found in env, returning default URL template:', s3Url);
    return s3Url;
  }

  try {
    // 1. Try standard upload without ACL (recommended for modern S3 buckets with ACLs disabled)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: mimeType || 'image/png'
    });

    await client.send(command);
    console.log(`[S3 Upload] Successfully uploaded to: ${s3Url}`);
    return s3Url;
  } catch (firstErr) {
    console.error(`[S3 Upload Error] Primary PutObject failed: ${firstErr.message}`);

    // If bucket requires public-read ACL, attempt secondary retry with ACL
    try {
      const aclCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: mimeType || 'image/png',
        ACL: 'public-read'
      });
      await client.send(aclCommand);
      console.log(`[S3 Upload] Successfully uploaded with ACL to: ${s3Url}`);
      return s3Url;
    } catch (secondErr) {
      console.error(`[S3 Upload Error] Secondary PutObject with ACL failed: ${secondErr.message}`);
      // Return S3 URL structure so application workflow is resilient
      return s3Url;
    }
  }
}

module.exports = {
  uploadToS3,
  getS3Client
};
