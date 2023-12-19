/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
/* eslint-disable no-template-curly-in-string */
import * as yup from 'yup'
import isUUID from 'validator/lib/isUUID'
import isURL from 'validator/lib/isURL'

import { XMLValidator } from 'fast-xml-parser'



// https://ibm.github.io/watson-machine-learning-sdk/model.html#ibm_watson_machine_learning.foundation_models.utils.enums.ModelTypes
const VALID_WATSONX_MODELS_ARR = [
  'google/flan-ul2',
  'google/flan-t5-xxl',
  'eleutherai/gpt-neox-20b',
  'ibm/granite-13b-chat-v1',
  'ibm/granite-13b-instruct-v1',
  'meta-llama/llama-2-70b-chat',
  'ibm/mpt-7b-instruct',
  'bigscience/mt0-xxl',
  'bigcode/starcoder',
]

export const VALID_WATSONX_MODELS = VALID_WATSONX_MODELS_ARR.map((x) => ({ id: x, name: x }))

