import * as React from 'react'
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin'

const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <RichTextField source="body" />
    </SimpleShowLayout>
  </Show>
)

export default PostShow
