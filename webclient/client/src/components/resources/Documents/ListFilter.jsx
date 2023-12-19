/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import { AutocompleteInput, ReferenceInput, TextInput, NullableBooleanInput, DateInput } from 'react-admin'
import { Search } from '@carbon/icons-react'
import { ChipsInput } from '../../carbon-ra'

const ListFilter = [
  <ReferenceInput
    source="id"
    resettable
    fullWidth
    alwaysOn
    reference="documents"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      ),
    }}
  >
    <AutocompleteInput filterToQuery={(searchText) => ({ name: searchText })} />
  </ReferenceInput>,
//   <DateInput source="created_at" />,
//   <DateInput source="updated_at" />,
]

export default ListFilter
