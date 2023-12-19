/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import { Pagination as RaPagination } from 'react-admin'

const Pagination = (props) => !!props.total && <RaPagination {...props} />

export default Pagination
