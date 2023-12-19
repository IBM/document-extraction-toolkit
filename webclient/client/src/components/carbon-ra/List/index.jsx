/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import { List as ReactAdminList, BulkDeleteButton, Pagination as ReactAdminPagination } from 'react-admin'

import ListActions from '../ListActions'

const List = ReactAdminList

const DefaultRowsPerPageOptions = [10, 25, 50] // doubled our rows per page

List.defaultProps = {
  undoable: false,
  perPage: 10,
  pagination: <ReactAdminPagination rowsPerPageOptions={DefaultRowsPerPageOptions} />,
  actions: <ListActions />,
}

export default List
