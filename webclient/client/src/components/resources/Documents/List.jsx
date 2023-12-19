import { Datagrid, TextField, ReferenceField, DateField, NumberField } from 'react-admin'
import { Typography } from '@mui/material'
import { EditButton, List, ShowButton, RelativeTimeField } from 'components/carbon-ra'
import ListActions from './ListActions'
import ItemFilter from './ItemFilter'
import ListFilter from './ListFilter'
const PostList = () => (
  <List hasCreate
  actions={<ListActions />}
  filters={ListFilter}
  sort={{ field: 'created_at', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" />
      {/* <ShowButton label={'ra_custom.action.read'}/> */}
      <ItemFilter />
      <TextField source="name" />
      <NumberField source="page_length" />
      {/* 
      <ReferenceField source="user_id" reference="users" /> 
      <ReferenceField source="role_id" reference="roles" />  */}
      <RelativeTimeField source="created_at" />
      <RelativeTimeField source="updated_at" />
      {/* <TextField source="md5_hash" /> */}
      <EditButton />
    </Datagrid>
  </List>
)

export default PostList
