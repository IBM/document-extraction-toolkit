import * as React from 'react'
import { SimpleForm, TextInput, ReferenceInput, SelectInput, NumberInput, SimpleFormIterator, ArrayInput } from 'react-admin'
import { Create, Toolbar } from 'components/carbon-ra'
import { VALID_WATSONX_MODELS } from 'utils/validators'

// https://marmelab.com/react-admin/Create.html
// You can customize the <Create> component using the following props:

// actions: override the actions toolbar with a custom component
// aside: component to render aside to the main content
// children: the components that renders the form
// className: passed to the root component
// component: override the root component
// disableAuthentication: disable the authentication check
// mutationOptions: options for the dataProvider.create() call
// record: initialize the form with a record
// redirect: change the redirect location after successful creation
// resource: override the name of the resource to create
// sx: Override the styles
// title: override the page title
// transform: transform the form data before calling dataProvider.create()

const sample_prompt = `Answer the question as precise as possible using the provided context. If the answer is
not contained in the context, say "None" \n\n 
Context: \n {context}?\n
Question: \n {question} \n
Answer:
`

const PromptsCreate = () => (
  <Create>
    <SimpleForm toolbar={<Toolbar />}>
      <TextInput source="name" />
      <SelectInput source="model_name" choices={VALID_WATSONX_MODELS} />
      <NumberInput source="model_configuration.min_new_tokens" min={0} step={1} defaultValue={0} />
      <NumberInput source="model_configuration.max_new_tokens" min={0} step={1} defaultValue={100} />
      <NumberInput source="model_configuration.temperature" min={0} step={0.01} defaultValue={0.05} />
      <TextInput source="template" defaultValue={sample_prompt} multiline fullWidth/>
      <ArrayInput source="questions">
        <SimpleFormIterator inline fullWidth>
          <TextInput source="field" helperText={false} />
          <TextInput source="question" helperText={false} fullWidth/>
        </SimpleFormIterator>
      </ArrayInput>
   </SimpleForm>
  </Create>
)

export default PromptsCreate
