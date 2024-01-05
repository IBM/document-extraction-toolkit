import { useState, useEffect } from 'react'
import { Datagrid, TextField, ReferenceField, DateField, useRecordContext, SimpleShowLayout, BooleanField, ArrayField, SingleFieldList, ChipField } from 'react-admin'
import { Typography, useMediaQuery } from '@mui/material'
import { EditButton, List, ShowButton, RelativeTimeField } from 'components/carbon-ra'
import { ZoomIn, CertificateCheck } from '@carbon/icons-react'

import ListFilter from './ListFilter'

const PostShow = () => {
  const record = useRecordContext();
  const { access_token } = JSON.parse(localStorage.getItem('token'));
  const [contentLink, setContentLink] = useState();
  useEffect(() => {
    if (!contentLink) {
      console.log(`getting signed link for ${record.s3_key}`)
      fetch(`/api/s3/getlink?bucket=${record.s3_bucket}&key=${record.s3_key}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          setContentLink(data.link)
        })
        .catch(error => {
          console.error('Error fetching pre signed s3 link', error);
        });
    }
  }, [record.s3_key]); // The empty dependency array ensures this effect runs only once

  return (
    <SimpleShowLayout>
      <ArrayField source="extraction_results">
        <Datagrid bulkActionButtons={false} >
          <TextField source="field" />
          <TextField source="value" />
        </Datagrid>
      </ArrayField>
      <div>
        <img src={`${contentLink}`} alt='annotated pdf file' />
      </div>
    </SimpleShowLayout>
  )
};

const PostList = () => {
  return (
    <List hasCreate filters={ListFilter}
      sort={{ field: 'updated_at', order: 'DESC' }}>
      <Datagrid expand={<PostShow />}
        expandSingle
        rowClick="expand"
      >
        {/* <TextField source="id" /> */}
        <ReferenceField source="doc_id" reference="documents" link="show" />
        <TextField source="page_info" />
        <ReferenceField source="prompt_id" reference="prompts" link="show" />
        {/* <ReferenceField source="user_id" reference="users" /> */}
        <ArrayField source="extraction_results">
          <SingleFieldList inline>
            <ChipField source="field" />
            {/* <TextField source="question"/> */}
          </SingleFieldList>
        </ArrayField>
        <BooleanField source="needs_review" TrueIcon={ZoomIn} FalseIcon={CertificateCheck} />
        <EditButton />
        <ShowButton />
        <TextField source="comments" fullWidth />
        {/* <TextField source="index_start" />
      <TextField source="index_end" /> */}
        {/* <RelativeTimeField source="created_at" /> */}
        <RelativeTimeField source="updated_at" />
      </Datagrid>
    </List>
  )
}


export default PostList
