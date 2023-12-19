import * as React from 'react'
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin'

import { Toolbar } from 'components/carbon-ra'

const PostEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextInput source="title" />
      <TextInput source="body" />
    </SimpleForm>
  </Edit>
)

export default PostEdit
