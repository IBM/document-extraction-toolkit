/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
const nconf = require('nconf')
const config = nconf.env().get()

// const requiredParams = ['API_SERVER_URL']

// requiredParams.forEach((key) => {
//   if (!config[key]) {
//     console.error(`Required parameter is missing: ${key}`)
//     process.exit(1)
//   }
// })

module.exports = config
