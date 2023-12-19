import { Datagrid, TextField, DateField, BooleanField } from 'react-admin'
import { Typography } from '@mui/material'
import { EditButton, List, ShowButton } from 'components/carbon-ra'

const Aside = () => (
  <div style={{ width: 300, margin: '1em' }}>
    <Typography variant="h6">Post details</Typography>
    <Typography variant="body2">Posts will only be published once an editor approves them</Typography>
  </div>
)

const PostList = () => (
  <List aside={<Aside />} hasCreate>
    <Datagrid>
      <TextField source="id" />
      <ShowButton />
      <TextField source="title" />
      <EditButton />
    </Datagrid>
  </List>
)

export default PostList
