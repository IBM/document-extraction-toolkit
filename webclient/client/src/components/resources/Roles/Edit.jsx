import * as React from 'react'
import { Edit, SimpleForm, TextInput, required, ReferenceInput, TextField } from 'react-admin'

import { Toolbar } from 'components/carbon-ra'

const PostEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextField source="id"/>
      <TextInput source="name" validate={[required()]} fullWidth />
      <TextInput source="description" validate={[required()]} fullWidth multiline />
    </SimpleForm>
  </Edit>
)

export default PostEdit
