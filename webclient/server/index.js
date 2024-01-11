/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
// import env
require('dotenv-expand').expand(require('dotenv').config())

const express = require('express')
const session = require('express-session')
const path = require('path')

const compression = require('compression')
const hpp = require('hpp')
const morgan = require('morgan')
const cors = require('cors')

const passport = require('passport');
const APIStrategy = require("ibmcloud-appid").APIStrategy;

const config = require('./utils/config')

const uiRoutes = require('./routes/uiRoutes')

const forceSSL = config.FORCE_SSL === 'true'
const staticFilesPath = path.join(__dirname, 'public') // from client/build (copied via dockerfile)
const PORT = config.SERVER_PORT || 7001
const REACT_APP_OIDC_ISSUER = config.REACT_APP_OIDC_ISSUER

const oidcRoutes = require('./routes/oidcToken')

// express app
const app = express()

app.use(passport.initialize());

// Don't expose any software information to hackers.
app.disable('x-powered-by')

// Response compression.
app.use(compression({ level: 9 }))

// Enable CORS.
app.use(cors())

// Prevent HTTP Parameter pollution.
app.use(hpp())

// Enable logging
app.use(morgan('dev'))

if (forceSSL) {
  // Enable reverse proxy support in Express. This causes the
  // the "X-Forwarded-Proto" header field to be trusted so its
  // value can be used to determine the protocol.
  app.enable('trust proxy')

  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next()
    } else {
      // request was via http, so redirect to https
      res.redirect(`https://${req.headers.host}${req.url}`)
    }
  })
}

// configure session
let sessionStore

if (config.REDIS_URL) {
  // eslint-disable-next-line global-require
  const redis = require('redis')
  const RedisSession = require('connect-redis')(session)
  let redisClient
  if (config.REDIS_URL.includes('rediss://')) {
    let socket = { tls: true, rejectUnauthorized: false }
    let tlsSecureContext
    // https://nodejs.org/api/tls.html#tlscreatesecurecontextoptions
    if (config.REDIS_CA_CRT_PATH) {
      socket.rejectUnauthorized = true
      tlsSecureContext = { ...tlsSecureContext, ca: config.REDIS_CA_CRT_PATH }
      console.log('Verifying Redis CA cert')
    }
    if (config.REDIS_CLIENT_CRT_PATH) {
      socket.rejectUnauthorized = true
      tlsSecureContext = { ...tlsSecureContext, cert: config.REDIS_CLIENT_CRT_PATH }
      console.log('Using Redis client cert')
    }
    if (config.REDIS_CLIENT_KEY_PATH) {
      socket.rejectUnauthorized = true
      tlsSecureContext = { ...tlsSecureContext, key: config.REDIS_CLIENT_KEY_PATH }
      console.log('Using Redis client key')
    }
    socket.tls = { ...tlsSecureContext }
    console.log('redis socket: ', socket)

    redisClient = redis.createClient({ legacyMode: true, url: config.REDIS_URL, socket })
    console.log('redis socket: ', socket)
  } else {
    redisClient = redis.createClient({ legacyMode: true, url: config.REDIS_URL })
  }
  redisClient.connect().catch(console.error)
  sessionStore = new RedisSession({ client: redisClient })
}

app.use(
  session({
    store: sessionStore,
    secret: '123456',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: forceSSL,
    },
  })
)
if (config.SERVER_OIDC_CLIENT_SECRET) {
  passport.use(new APIStrategy({
    oauthServerUrl: REACT_APP_OIDC_ISSUER
  }));
}

function requireAuth(req, res, next) {
  if (config.SERVER_OIDC_CLIENT_SECRET) {
    passport.authenticate(APIStrategy.STRATEGY_NAME, {
      session: false
    })(req, res, next)
  } else {
    next()
  }
}

app.use('/api', oidcRoutes)
app.use('/api', requireAuth, uiRoutes)

// static files
app.use(express.static(staticFilesPath))

// all other requests, serve index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'))
})

if (!module.parent) {
  // Start the server
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(`===> 🌎 Express Server started on port: ${PORT}!`)
  })
}

module.exports = app
