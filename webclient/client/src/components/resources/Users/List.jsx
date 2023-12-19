import { Datagrid, TextField, ReferenceField, DateField, NumberField, EmailField } from 'react-admin'
import { Typography } from '@mui/material'
import { EditButton, List, ShowButton, RelativeTimeField } from 'components/carbon-ra'

const PostList = () => (
  <List hasCreate>
    <Datagrid>
      <TextField source="id" />
      <ShowButton />
      <EmailField source="email" />
      <TextField source="first_name" />
      <TextField source="last_name" />
      <TextField source="company" />
      <RelativeTimeField source="created_at" />
      <EditButton />
    </Datagrid>
  </List>
)

export default PostList
