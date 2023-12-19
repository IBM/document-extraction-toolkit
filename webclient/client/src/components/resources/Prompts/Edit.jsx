import * as React from 'react'
import { Edit, SimpleForm, TextInput, SelectInput, NumberInput, ArrayInput,SimpleFormIterator } from 'react-admin'

import { Toolbar } from 'components/carbon-ra'
import {VALID_WATSONX_MODELS} from 'utils/validators'
const PromptEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextInput source="name" />
      <SelectInput source="model_name" choices={VALID_WATSONX_MODELS} />
      <NumberInput source="model_configuration.min_new_tokens" min={0} step={1} defaultValue={0} />
      <NumberInput source="model_configuration.max_new_tokens" min={0} step={1} defaultValue={100} />
      <NumberInput source="model_configuration.temperature" min={0} step={0.01} defaultValue={0.05} />
      <TextInput source="template" multiline fullWidth />
      <ArrayInput source="questions">
        <SimpleFormIterator inline>
          <TextInput source="field" helperText={false} />
          <TextInput source="question" helperText={false} fullWidth/>
        </SimpleFormIterator>
      </ArrayInput>
   </SimpleForm>
  </Edit>
)

export default PromptEdit
