/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
const express = require('express')

const documents = require('./documents')
const pgProxy = require('./pgProxy')
const s3 = require('./s3')

const router = express.Router()

router.use('/', documents)
router.use('/s3', s3)
// Place this one last!
router.use('/', pgProxy)

module.exports = router
