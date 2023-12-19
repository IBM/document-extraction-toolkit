const express = require('express')
const COSRepoBase = require('../utils/cos')
const config = require('../utils/config')

const router = express.Router()
const COSRepo = new COSRepoBase(process.env.S3_ENDPOINT, process.env.COS_APIKEY, process.env.COS_SERVICE_INSTANCE_ID)

router
  .get('/buckets/:name', (req, res) => {
    COSRepo.doListObjects(req.params.name, null, null, 100, req.query.prefix)
      .then((result) => {
        res.type('application/json')
        res.json(result)
      })
      .catch((e) => {
        res.status(404).send(e)
      })
  })
  .get('/buckets', (req, res) => {
    COSRepo.doListBuckets()
      .then((result) => {
        res.type('application/json')
        res.json(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
  .get('/get', async (req, res) => {
    try {
      const objHead = await COSRepo.doHeadObject(req.query.bucket, req.query.key)
      const serverEtag = objHead.ETag
      const clientEtag = req.get('If-None-Match')
      if (clientEtag === serverEtag) res.status(304).end()
      else {
        const period = 60 * 60 * 8
        const obj = await COSRepo.doGetObject(req.query.bucket, req.query.key)
        res.set('ETag', serverEtag)
        res.set('Content-Type', obj.ContentType)
        res.set('Cache-control', `private, max-age=${period}`) //tell browser ok to cache files
        res.send(obj.Body)
      }
    } catch (e) {
      console.log(e)
      res.status(e.statusCode || 500).send(e.message || 'Error retrieving COS object')
    }
  })
  .get('/getlink', async (req, res) => {
    try {
      const link = await COSRepo.doGetPreSignedUrl(req.query.bucket, req.query.key)
      res.json({link})
    } catch (e) {
      console.log(e)
      res.status(e.statusCode || 500).send(e.message || 'Error retrieving COS object')
    }
  })

module.exports = router
