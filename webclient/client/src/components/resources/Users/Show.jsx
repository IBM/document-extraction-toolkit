import * as React from 'react'
import { Show, SimpleShowLayout, TextField, DateField, ReferenceField, NumberField, EmailField } from 'react-admin'

const PostShow = () => (
  <Show>
    <SimpleShowLayout>
    <TextField source="id" />
    <TextField source="first_name" name fullWidth />
      <TextField source="last_name" name fullWidth />
      <EmailField source="email" name fullWidth />
      <TextField source="company" name fullWidth />
      <DateField source="created_at" showTime/>
      <DateField source="updated_at" showTime/>
    </SimpleShowLayout>
  </Show>
)

export default PostShow
