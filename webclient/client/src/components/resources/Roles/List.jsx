import { Datagrid, TextField, ReferenceField } from 'react-admin'
import { Typography } from '@mui/material'
import { InlineNotification } from '@carbon/react'
import { EditButton, List, ShowButton } from 'components/carbon-ra'

const PostList = () => (
  <>
    <InlineNotification
      actionButtonLabel="Action"
      statusIconDescription="warning"
      subtitle="Role system Not in effect"
      title="Non-production System"
      kind="warning"
      hideCloseButton
    />
    <List hasCreate>
      <Datagrid>
        <TextField source="id" />
        <ShowButton />
        <TextField source="name" />
        <TextField source="description" />
        <EditButton />
      </Datagrid>
    </List>
  </>

)

export default PostList
