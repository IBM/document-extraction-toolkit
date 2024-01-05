import { Datagrid, TextField, ArrayField, SingleFieldList, NumberField, ChipField, SimpleShowLayout } from 'react-admin'
import { useMediaQuery } from '@mui/material'
import { List, ShowButton, EditButton, RelativeTimeField } from 'components/carbon-ra'

const PostShow = () => {
  return (
    <SimpleShowLayout>
      <TextField source="template" />
      <ArrayField source="questions">
        <Datagrid bulkActionButtons={false} >
          <TextField source="field" />
          <TextField source="question" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  )
};

const PromptList = () => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
  return (
  <List hasCreate sort={{ field: 'updated_at', order: 'DESC' }}  >
    <Datagrid expand={<PostShow />}
      sx={{
        '& td.column-template': {
          maxWidth: isDesktop ? 400 : 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }}
      rowClick="expand">
      <TextField source="id" />
      <ShowButton />
      <EditButton />
      <TextField source="name" />
      <TextField source="model_name" />
      <NumberField source="model_configuration.min_new_tokens" />
      <NumberField source="model_configuration.max_new_tokens" />
      <NumberField source="model_configuration.temperature" />
      <TextField source="template" />
      <ArrayField source="questions">
        <SingleFieldList inline>
          <ChipField source="field" />
          {/* <TextField source="question"/> */}
        </SingleFieldList>
      </ArrayField>

      <RelativeTimeField source="created_at" />
      <RelativeTimeField source="updated_at" />
    </Datagrid>
  </List>
)}

export default PromptList
