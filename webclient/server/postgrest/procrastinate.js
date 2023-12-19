const request = require('superagent');
const {
    transformNumber,
    transformEmpty,
    transformBoolean,
    transformArray,
    transformEmptyJSON,
    transformEmptyString,
} = require('../utils/helpers')

const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const authToken = jwt.sign({ role: 'writer' }, config.PGRST_JWT_SECRET)

async function bulkProcrastinateTasks(data) {
    const transformedData = data.map(
        ({
          queue_name,
          task_name,
          args,
        }) => ({
          queue_name: transformEmptyString(queue_name),
          task_name: transformEmptyString(task_name),
          args: transformEmptyJSON(args),
        })
      )
    console.log(transformedData)
    return await request
        .post(`${config.POSTGREST_URL}/procrastinate_jobs`)
        .set('Content-Profile', 'public') // change schema to public.procrastinate
        .set('accept', 'application/json') // suppress a 406 error from postgresT
        .set('Prefer', 'return=representation') // return the objects so we know the IDs
        .auth(authToken, { type: 'bearer' })
        .send(transformedData)
}

module.exports = {
  bulkProcrastinateTasks
}
