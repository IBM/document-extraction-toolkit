import * as React from 'react'
import { Edit, SimpleForm, TextInput, required, ReferenceInput, TextField,DateTimeInput, NumberInput } from 'react-admin'

import { Toolbar } from 'components/carbon-ra'

const PostEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextField source="id"/>
      <ReferenceInput source="user_id" reference="users" />
      <ReferenceInput source="role_id" reference="roles" />
      <TextInput source="name" validate={[required()]} fullWidth />
      <NumberInput source="page_length" />
      <DateTimeInput source="created_at" />
      <TextInput source="md5_hash" fullWidth multiline />
    </SimpleForm>
  </Edit>
)

export default PostEdit
