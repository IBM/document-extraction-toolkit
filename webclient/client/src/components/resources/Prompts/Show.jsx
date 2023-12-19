import * as React from 'react'
import { Show, SimpleShowLayout, TextField, DateField, Datagrid, NumberField , ArrayField} from 'react-admin'

const PromptsShow = () => (
  <Show actions={null}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="model_name" />
      <NumberField source="model_configuration.min_new_tokens" />
      <NumberField source="model_configuration.max_new_tokens" />
      <NumberField source="model_configuration.temperature" />
      <TextField source="template" multiline />
      <ArrayField source="questions">
        <Datagrid inline>
          <TextField source="field" />
          <TextField source="question" />
        </Datagrid>
      </ArrayField>
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
    </SimpleShowLayout>
  </Show>
)

export default PromptsShow
