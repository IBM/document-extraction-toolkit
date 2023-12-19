/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto');
const mime = require('mime-types')


const { MergeMap, isTrue, transformEmpty, transformEmptyJSON, transformEmptyString } = require('../utils/helpers')
const COSRepoBase = require('../utils/cos')

const { bulkUploadDocuments } = require('../postgrest/documents')
const { bulkProcrastinateTasks } = require('../postgrest/procrastinate')

const upload = multer({ dest: 'tmp/' })
const COSRepo = new COSRepoBase(process.env.S3_ENDPOINT, process.env.COS_APIKEY, process.env.COS_SERVICE_INSTANCE_ID)
var jsonParser = bodyParser.json({ limit: '512mb' })
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: '512mb' })
const router = express.Router()

// Take uploaded doc files
// write to postgrest
// upload to S3
// write to task table


router.post(
    '/documents',
    urlencodedParser,
    jsonParser,
    upload.fields([{ name: 'document_files[]' }]),
    async (req, res) => {
        const documentFiles = req.files && req.files['document_files[]']
        const { user_id, prompt_id } = req.body
        let documentMetadata = new MergeMap()
        try {
            if (documentFiles.length === 0) {
                return res.status(400).json({
                    message: 'Bad Request. Please include an document file.',
                })
            }

            documentFiles.forEach((file) => {
                const extension = path.extname(file.originalname)
                const name = path.basename(file.originalname, extension)
                documentMetadata.set(`${name}${extension}`, {
                    name,
                    s3_key: crypto.randomUUID(),
                    extension,
                    s3_prefix: 'uploads/',
                    s3_bucket: process.env.S3_DEF_BUCKET,
                    path: file.path,
                })
            })

            // upload document to COS
            await documentMetadata.forEach(async (file) => {
                console.log(`processing document file: ${file.name}`)

                await COSRepo.doCreateObject(
                    process.env.S3_DEF_BUCKET,
                    `uploads/${file.s3_key}${file.extension}`,
                    fs.readFileSync(file.path),
                    mime.lookup(file.extension)
                )

                // delete file after uploading
                fs.unlinkSync(file.path)
            })

            const data = Array.from(documentMetadata.values())
            console.log(data)
            const uploadResults = await bulkUploadDocuments(data)
            console.log(uploadResults.body)
            const task_data = []
            for (const doc of Array.from(uploadResults.body)) {
                for (const prompts of prompt_id) {
                    task_data.push({
                        queue_name: 'default',
                        args: { id: doc.id, prompt_id: prompts },
                        task_name: 'procrastinateworker.worker.echo'
                    })
                }
            }

            // const task_data = Array.from(uploadResults.body).map(x => ({
            //     queue_name: 'default',
            //     args: { id: x.id },
            //     task_name: 'procrastinateworker.worker.echo'
            // }))
            console.log(task_data)
            const procrastinateResult = await bulkProcrastinateTasks(task_data)
            console.log(procrastinateResult.body)
            // now add all docs to tasks table
            // remember to switch schemas using Content-Profile
            return res.status(201).json(uploadResults)
        } catch (err) {
            console.log(err)
            let response = {
                message: err.message || 'Error while ingesting the document file(s)',
            }
            if (err.response) {
                response = err.response.body
            }
            return res.status(err.statusCode || err.status || 500).json(response)
        }
    }
)

module.exports = router
