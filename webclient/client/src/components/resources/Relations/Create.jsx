import * as React from 'react'
import { SimpleForm, TextInput, ReferenceInput, required , NumberInput, DateInput} from 'react-admin'
import { Create, Toolbar } from 'components/carbon-ra'


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

const PostCreate = () => (
  <Create>
    <SimpleForm toolbar={<Toolbar />}>
      <ReferenceInput source="doc_id" reference="documents" />
      <ReferenceInput source="user_id" reference="users" />
      <ReferenceInput source="prompt_id" references="prompts" />
      <TextInput source="extraction_summary" />
      <TextInput source="index_start" />
      <TextInput source="index_end" />
    </SimpleForm>
  </Create>
)

export default PostCreate
