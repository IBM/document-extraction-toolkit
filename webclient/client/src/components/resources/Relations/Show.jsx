import { useState, useEffect } from 'react'
import { Show, SimpleShowLayout, TextField, DateField, ReferenceField, useRecordContext, ArrayField, Datagrid } from 'react-admin'

const image = (id, filePath) => {
  return (
    <div>
      <img src={`${filePath}`} title={`${id}`} alt='annotated pdf file' />
    </div>
  )
}

const ImageFileField = (props) => {
  const record = useRecordContext(props)
  const { access_token } = JSON.parse(localStorage.getItem('token')) || { access_token: false };
  const [contentLink, setContentLink] = useState();
  useEffect(() => {
    if (!contentLink) {
      console.log(`getting signed link for ${record.s3_key}`)
      const headers = {
        'Content-Type': 'application/json',
      };
      if (access_token) {
        headers['Authorization'] = `Bearer ${access_token}`;
      }
      fetch(`/api/s3/getlink?bucket=${record.s3_bucket}&key=${record.s3_key}`, {
        method: 'GET',
        headers: headers,
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


  return record ? image(record.id, contentLink) : null
}


const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="doc_id" reference="documents" />
      <ReferenceField source="prompt_id" reference="prompts" link="show" />
      <TextField source="comments" fullWidth />
      <ArrayField source="extraction_results">
        <Datagrid bulkActionButtons={false} >
          <TextField source="field" />
          <TextField source="value" />
        </Datagrid>
      </ArrayField>
      <TextField source="page_info" fullWidth multiline />
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
      <ImageFileField />
    </SimpleShowLayout>
  </Show>
)

export default PostShow
