/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'

import {
  BooleanInput,
  Create,
  FileField,
  FileInput,
  FormDataConsumer,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  TextInput,
  AutocompleteArrayInput,
  AutocompleteInput,
  SimpleForm,
} from 'react-admin'
import { Grid, Column, InlineNotification } from '@carbon/react'

import { ChipsInput, Toolbar } from 'components/carbon-ra'

const Upload = ({ ...props }) => (
<>
<InlineNotification
  actionButtonLabel="Action"
  statusIconDescription="warning"
  subtitle="DO NOT UPLOAD DOCUMENTS WITH PII"
  title="Non-production System"
  kind="warning"
  hideCloseButton
/>


<Create resource="documents" {...props} redirect="list">
    <SimpleForm variant="standard" margin="normal" toolbar={<Toolbar />}>
      <Grid>
        <Column lg={12}>
          <FileInput
            source="document_files"
            label="resources.documents.headers.document_files"
            accept="application/pdf"
            validate={required()}
            multiple={true}
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Column>
        <Column lg={12} />
        <Column lg={12} >
        <ReferenceArrayInput source="prompt_id" reference='prompts'>
          <AutocompleteArrayInput validate={required()} />
        </ReferenceArrayInput>
        </Column>
      </Grid>
    </SimpleForm>
  </Create>
</>
)
export default Upload
