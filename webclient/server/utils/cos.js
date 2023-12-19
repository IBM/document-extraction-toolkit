/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
const AWS = require('ibm-cos-sdk')
const mime = require('mime-types')
class COSRepo {
  constructor(endpoint, apiKeyId, serviceInstanceId) {
    const config = {
      s3ForcePathStyle: true,
      endpoint,
      apiKeyId,
      ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
      serviceInstanceId,
    }
    this.cos = new AWS.S3(config)
    this.IBMServiceInstanceId = config.serviceInstanceId
  }

  doCreateBucket(bucketName, location) {
    return this.cos
      .createBucket({
        Bucket: bucketName,
        CreateBucketConfiguration: {
          LocationConstraint: location,
        },
      })
      .promise()
  }

  doCreateObject(bucketName, key, body, mime) {
    const s3 = this.cos
    return s3.headBucket({ Bucket: bucketName })
      .promise()
      .then(() => {
        return s3.putObject({
          Bucket: bucketName,
          Key: key,
          Body: body,
          ContentType: mime,
        }).promise()
      })
      .catch((headBucketError) => {
        if (headBucketError.statusCode === 404) {
          return s3.createBucket({ Bucket: bucketName }).promise()
            .then(() => {
              // Bucket created successfully, now upload the object
              return s3.putObject({
                Bucket: bucketName,
                Key: key,
                Body: body,
                ContentType: mime,
              }).promise();
            });
        } else {
          throw headBucketError; // If it's another error, re-throw it
        }
      })
  }

  doDeleteObject(bucketName, key) {
    return this.cos
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise()
  }

  doDeleteBucket(bucketName) {
    return this.cos
      .deleteBucket({
        Bucket: bucketName,
      })
      .promise()
  }

  doListBuckets() {
    const params = {
      IBMServiceInstanceId: this.IBMServiceInstanceId,
    }

    return this.cos.listBuckets(params).promise()
  }

  doListObjects(bucketName, delimiter, marker, maxKeys, prefix) {
    const params = {
      Bucket: bucketName /* required */,
      Delimiter: delimiter /* A delimiter is a character you use to group keys. */,
      EncodingType: 'url',
      Marker: marker /* Specifies the key to start with when listing objects in a bucket. */,
      MaxKeys: maxKeys,
      Prefix: prefix /* Limits the response to keys that begin with the specified prefix. */,
    }
    return this.cos.listObjects(params).promise()
  }

  doGetObject(bucketName, key) {
    const params = {
      Bucket: bucketName /* required */,
      Key: key /* required */,
    }
    return this.cos.getObject(params).promise()
  }
  doHeadObject(bucketName, key) {
    const params = {
      Bucket: bucketName /* required */,
      Key: key /* required */,
    }
    return this.cos.headObject(params).promise()
  }
  doGetPreSignedUrl(bucketName, key) {
    const params = {
      Bucket: bucketName /* required */,
      Key: key /* required */,
    }
    return this.cos.getSignedUrl('getObject', params)
  }
}

module.exports = COSRepo
