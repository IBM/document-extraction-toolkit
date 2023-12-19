import { Datagrid, TextField, ReferenceField, DateField, NumberField } from 'react-admin'
import { Typography } from '@mui/material'
import {  List, ShowButton, RelativeTimeField } from 'components/carbon-ra'

const PostList = () => (
  <List hasCreate sort={{ field: 'updated_at', order: 'DESC' }}  >
    <Datagrid>
      <TextField source="id" />
      <ShowButton />
      <ReferenceField source="user_id" reference="users" />
      <ReferenceField source="doc_id" reference="documents" />
      <NumberField source="percentage_loaded" />
      <TextField source="task_status" />
      <RelativeTimeField source="created_at" />
      <RelativeTimeField source="updated_at" />
    </Datagrid>
  </List>
)

export default PostList
