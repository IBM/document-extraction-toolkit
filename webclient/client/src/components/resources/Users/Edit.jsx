import * as React from 'react'
import { Edit, SimpleForm, TextInput, required, ReferenceInput, TextField,DateTimeInput, NumberInput } from 'react-admin'

import { Toolbar } from 'components/carbon-ra'

const PostEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextField source="id"/>
      <TextInput source="first_name" validate={[required()]} fullWidth />
      <TextInput source="last_name" validate={[required()]} fullWidth />
      <TextInput source="email" validate={[required()]} fullWidth />
      <TextInput source="company" validate={[required()]} fullWidth />
    </SimpleForm>
  </Edit>
)

export default PostEdit
