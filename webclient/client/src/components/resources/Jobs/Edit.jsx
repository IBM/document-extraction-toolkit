import * as React from 'react'
import { Edit, SimpleForm, TextInput, required, ReferenceInput, TextField,DateTimeInput, NumberInput } from 'react-admin'

import { Toolbar } from 'components/carbon-ra'

const PostEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextField source="id"/>
      <NumberInput source="percentage_loaded" />
      <ReferenceInput source="user_id" reference="users" />
      <ReferenceInput source="doc_id" reference="documents" />
    </SimpleForm>
  </Edit>
)

export default PostEdit
