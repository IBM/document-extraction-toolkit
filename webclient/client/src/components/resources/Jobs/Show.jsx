import * as React from 'react'
import { Show, SimpleShowLayout, TextField, DateField, ReferenceField, NumberField } from 'react-admin'

const PostShow = () => (
  <Show actions={null}>
    <SimpleShowLayout>
      <ReferenceField source="user_id" reference="users" />
      <ReferenceField source="doc_id" reference="documents" />
      <NumberField source="percentage_loaded" />
      <DateField source="created_at" showTime/>
      <DateField source="updated_at" showTime/>
    </SimpleShowLayout>
  </Show>
)

export default PostShow
