import {useState, useEffect} from 'react'
import { Edit, SimpleForm, TextInput, DateInput, ReferenceInput, TextField,useRecordContext, BooleanInput, SimpleFormIterator, ArrayInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { Toolbar } from 'components/carbon-ra'
import InputAdornment from '@mui/material/InputAdornment'
import { AddComment, TextSmallCaps, Json } from '@carbon/icons-react'
const image = (id, filePath) => {
  return (
    <div>
      <img src={`${filePath}`} title={`${id}`} />
    </div>
  )
}

const ImageFileField = (props) => {
  const record = useRecordContext(props)
  const { access_token } = JSON.parse(localStorage.getItem('token'));
  const [contentLink, setContentLink] = useState();
  useEffect(() => {
    if (!contentLink) {
      console.log(`getting signed link for ${record.s3_key}`)
      fetch( `/api/s3/getlink?bucket=${record.s3_bucket}&key=${record.s3_key}`, {
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


  return record ? image(record.id, contentLink) : null
}

const FormInput = ({ className, ...rest }) => {
  const { setValue } = useFormContext() //https://marmelab.com/react-admin/SimpleForm.html#usage
  const record = useRecordContext()
  return (
    <TextInput
      source="list_of_problems"
      multiline
      fullWidth
      onChange={(evt) => {
        // if needs_review is true, we set it to false when the user changed the mdi
        // TODO: needs robust way to do inter annotator agreement
        const needsReview = record.needs_review ? !(record.list_of_problems !== evt.target.value) : false
        setValue('needs_review', needsReview)
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <TextSmallCaps />
          </InputAdornment>
        ),
      }}
      className={className}
      {...rest}
    />
  )
}

const PostEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar />}>
      <TextField source="id"/>
      <ReferenceInput source="doc_id" reference="documents" />
      <ReferenceInput source="user_id" reference="users" />
      <ReferenceInput source="prompt_id" reference="prompts" />
      <TextInput source="extraction_summary" />
      <ArrayInput source="extraction_results">
        <SimpleFormIterator inline fullWidth>
          <TextInput source="field" helperText={false} />
          <TextInput source="question" helperText={false} fullWidth/>
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="needs_review" />
      <TextInput
            source="comments"
            fullWidth
            multiline
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AddComment />
                </InputAdornment>
              ),
            }}
          />
      <TextInput source="index_start" />
      <TextInput source="index_end" />
      <ImageFileField />
    </SimpleForm>
  </Edit>
)

export default PostEdit
