/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import { Create as ReactAdminCreate } from 'react-admin'

import CreateActions from './CreateActions'

const Create = ReactAdminCreate

Create.defaultProps = {
  actions: <CreateActions />,
}

export default Create
