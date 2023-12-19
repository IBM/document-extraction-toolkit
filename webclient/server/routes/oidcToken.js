const express = require('express')
const router = express.Router()
const superagent = require('superagent')
const config = require('../utils/config')
const bodyParser = require('body-parser')
const { REACT_APP_OIDC_ISSUER, SERVER_OIDC_CLIENT_ID, SERVER_OIDC_CLIENT_SECRET } = config

router
  .post('/token',bodyParser.json(), async (req, res) => {
    if (req.method === "OPTIONS") {
      return res.send();
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    if (!req.body.code) {
      res.status(400).json({ error: "Param `code` is missing" });
      return;
    }

    if (!req.body.code_verifier) {
      res.status(400).json({ error: "Param `code_verifier` is missing" });
      return;
    }

    const { code, code_verifier, redirect_uri } = req.body;

    const { body: openidConfiguration } = await superagent.get(`${REACT_APP_OIDC_ISSUER}/.well-known/openid-configuration`);
    const { token_endpoint } = openidConfiguration;

    const { body: token } = await superagent.post(token_endpoint)
      .type('form')
      .send({ client_id: SERVER_OIDC_CLIENT_ID })
      .send({ client_secret: SERVER_OIDC_CLIENT_SECRET })
      .send({ redirect_uri:  redirect_uri})
      .send({ code })
      .send({ code_verifier })
      .send({ grant_type: "authorization_code" })

    if (token.error) {
      res.status(400);
    }

    res.json(token);
  })

router
  .get('/oidc', (req,res) => {
    if (REACT_APP_OIDC_ISSUER) {
      res.json({
        enabled: true,
        REACT_APP_OIDC_ISSUER,
        REACT_APP_OIDC_CLIENT_ID: SERVER_OIDC_CLIENT_ID
      })
    } else {
      res.json({
        enabled: false,
        REACT_APP_OIDC_ISSUER,
        REACT_APP_OIDC_CLIENT_ID: SERVER_OIDC_CLIENT_ID
      })
    }
  })

module.exports = router
