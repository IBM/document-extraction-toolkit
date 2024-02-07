import {useState, useEffect} from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Show, SimpleShowLayout, TextField, DateField, ReferenceField, NumberField, useRecordContext, Button } from 'react-admin'

// s3_key character varying(256) not null,
// s3_prefix character varying(120),
// s3_bucket character varying(120),

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const PdfFileField = (props) => {
  const record = useRecordContext(props)
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
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
      fetch( `/api/s3/getlink?bucket=${record.s3_bucket}&key=${record.s3_prefix}${record.s3_key}${record.extension}`, {
        method: 'GET',
        headers: headers,
      })
      .then(response => response.json())
      .then(data => {
        console.log(`received signed link ${data.link}`)
        setContentLink(data.link)
      })
      .catch(error => {
        console.error('Error fetching pre signed s3 link', error);
      }); 
    }
  }, [record.s3_key]); // The empty dependency array ensures this effect runs only once


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  //const fileUrl = `/api/s3/get?bucket=${record.s3_bucket}&key=${record.s3_prefix}${record.s3_key}${record.extension}`

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = contentLink;
    link.download = `${record.s3_key}${record.extension}`;
    link.click();
  };

  return (record && contentLink) ?  (
    <>
      <Document
        file={contentLink}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <Button
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </Button>
        <Button onClick={handleDownload}>
          Download
        </Button>
      </div>
    </>
  ) : null
}

const PostShow = () => (
  <Show>
    <SimpleShowLayout>
    <TextField source="id" />
      <TextField source="name" />
      <NumberField source="page_length" />
      <ReferenceField source="user_id" reference="users" /> 
      <ReferenceField source="role_id" reference="roles" /> 
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime/>
      <TextField source="md5_hash" />
      <PdfFileField />
    </SimpleShowLayout>
  </Show>
)

export default PostShow
