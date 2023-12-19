import { Datagrid, TextField, ArrayField, SingleFieldList, NumberField,ChipField } from 'react-admin'
import { Typography } from '@mui/material'
import {  List, ShowButton, EditButton, RelativeTimeField } from 'components/carbon-ra'

const PromptList = () => (
  <List hasCreate sort={{ field: 'updated_at', order: 'DESC' }}  >
    <Datagrid>
      <TextField source="id" />
      <ShowButton />
      <EditButton />
      <TextField source="name" />
      <TextField source="model_name" />
      <NumberField source="model_configuration.min_new_tokens" />
      <NumberField source="model_configuration.max_new_tokens" />
      <NumberField source="model_configuration.temperature" />
      <TextField source="template"/>
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
)

export default PromptList
