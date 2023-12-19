/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
const express = require('express')
const router = express.Router()
const { createProxyMiddleware } = require('http-proxy-middleware')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const authToken = jwt.sign({ role: 'writer' }, config.PGRST_JWT_SECRET)

// everything else, remove just the base path and forward it to POSTGREST
router.use('/', (req, res, next) =>
createProxyMiddleware({
  target: config.POSTGREST_URL,
  changeOrigin: true,
  pathRewrite: {
    [`^${req.baseUrl}`]: '', // remove base path
  },
  onProxyReq: (proxyReq) => proxyReq.setHeader('Authorization', `Bearer ${authToken}`),
  logLevel: process.env.PG_LOG_LEVEL || 'info',
})(req, res, next)
)

module.exports = router
