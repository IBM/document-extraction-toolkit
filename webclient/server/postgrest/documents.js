const request = require('superagent');
const {
    transformNumber,
    transformEmpty,
    transformBoolean,
    transformArray,
    flatMap,
    transformEmptyString,
} = require('../utils/helpers')

const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const authToken = jwt.sign({ role: 'writer' }, config.PGRST_JWT_SECRET)

async function bulkUploadDocuments(data) {
    const transformedData = data.map(
        ({
          name,
          extension,
          s3_key,
          s3_prefix,
          s3_bucket,
        }) => ({
          name: transformEmptyString(name),
          extension: transformEmptyString(extension),
          s3_key: transformEmptyString(s3_key),
          s3_prefix: transformEmptyString(s3_prefix),
          s3_bucket: transformEmptyString(s3_bucket),
        })
      )

    return await request
        .post(`${config.POSTGREST_URL}/documents`)
        .set('accept', 'application/json') // suppress a 406 error from postgresT
        .set('Prefer', 'return=representation') // return the objects so we know the IDs
        .auth(authToken, { type: 'bearer' })
        .send(transformedData)
}

module.exports = {
    bulkUploadDocuments
}
