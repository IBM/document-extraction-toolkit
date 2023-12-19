import * as React from 'react'
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin'

const PostShow = () => (
  <Show>
    <SimpleShowLayout>
    <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
)

export default PostShow
