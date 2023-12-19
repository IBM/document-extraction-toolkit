from procrastinate import App, AiopgConnector
import asyncio
import os
from dotenv import load_dotenv
import tempfile
import time

from .s3client import s3_client
from .postgrestclient import make_authenticated_request
from .utils import extract_relations, highlight

load_dotenv()

print(os.getenv("DB_HOST", None))

async def set_role_on_connect(conn):
    role = "writer"

    async with conn.cursor() as cursor:
        await cursor.execute(f"SET ROLE {role}")

# Make an app in your code
app = App(connector=AiopgConnector(host=os.getenv("DB_HOST", None), user=os.getenv("DB_USER", None), 
        password=os.getenv("DB_PASS", None), port=os.getenv("DB_PORT", None), dbname=os.getenv("DB_NAME", None),
        on_connect=set_role_on_connect))

#app.open()

# Write new worker task
# Receive worker tasks by doc ID (procrastinate)
# Lookup document from documents table by ID (postgrest)
# Download file from s3
# get parameters from postgrest
# get prompts from postgrest
# process pdf
# upload annotations and images to s3 and postgrest

# Define tasks using coroutine functions
@app.task()
async def echo(id, prompt_id):
    print("EXECUTING process")
    await asyncio.sleep(5)
    print(os.getenv("DB_HOST", None))
    document = make_authenticated_request("documents", query_params={"id":f"eq.{id}"})
    prompt = make_authenticated_request("prompts", query_params={"id":f"eq.{prompt_id}"})[0]
    print(document)
    print(prompt)
    if len(document) == 1:
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                bucket = document[0]["s3_bucket"]
                s3_full_key =  f"{document[0]['s3_prefix']}{document[0]['s3_key']}{document[0]['extension']}"
                pdf_file = s3_client.download_file(document[0]["s3_bucket"], s3_full_key,
                                                    os.path.join(temp_dir, f"{document[0]['s3_key']}{document[0]['extension']}")
                                                    )
                pdf_temp_file = os.path.join(temp_dir, f"{document[0]['s3_key']}{document[0]['extension']}")
                job_id = None
                # list answers is answers strings to questions[]
                # relations is a DF object
                relations, outer_list_answers, job_id, page_count = extract_relations(f"{document[0]['s3_key']}{document[0]['extension']}", pdf_temp_file, 10, 10, prompt, doc_id=id)
                document_payload = {
                "page_length": page_count
                }
                make_authenticated_request("documents", method="PATCH", data=document_payload,  query_params={"id":f"eq.{id}"})
                # do highlighting

                print('pre-highlighting')

                highlighted_pages, highlighted_bool = highlight(outer_list_answers, pdf_temp_file, temp_dir, job_id=job_id, doc_id=id, prompt_id=prompt_id)

                print('post-highlighting, pre uploading')
                job = {
                    "id": job_id,
                    "doc_id":id,
                    "prompt_id": prompt_id,
                    "percentage_loaded": 90,
                    "task_status": "Uploading Highlighted Previews"
                }
                make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})
                for ind, highlighted in enumerate(highlighted_pages):

                    if highlighted_bool[ind] == True:

                        try:
                            print(highlighted)
                            s3_upload_key =  f"{document[0]['s3_prefix']}{highlighted}"
                            s3_client.upload_file(os.path.join(temp_dir,highlighted),document[0]["s3_bucket"], s3_upload_key)
                        except:
                            continue

                print('post-uploading')
                print(f'debug relations: {relations}')
                print(f'debug highlighted_pages: {highlighted_pages}')

                relations_payload = []
                for index, item in enumerate(relations):
                    page_number = item.pop('page')
                    extracted_fields = []
                    for k,v in item.items():
                        extracted_data = {
                            "field": k,
                            "value": v
                        }
                        extracted_fields.append(extracted_data)
                    payload_item = {
                        "doc_id": id,
                        "s3_key":  f"{document[0]['s3_prefix']}{highlighted_pages[int(page_number)]}",
                        "s3_bucket": bucket,
                        "extraction_results": extracted_fields,
                        "prompt_id": prompt_id,
                        "page_info": page_number
                    }
                    relations_payload.append(payload_item)    
                print(relations_payload)

                uploaded_relations = make_authenticated_request("extracted_relations_live", method="POST", data=relations_payload)
                job = {
                    "id": job_id,
                    "doc_id":id,
                    "prompt_id": prompt_id,
                    "percentage_loaded": 100,
                    "task_status": "Finished All Processing"
                }
                make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})
        except Exception as e:
            print(f'exception: {e}')
            job = {
                "id": job_id,
                "doc_id":id,
                "prompt_id": prompt_id,
                "task_status": "Exception Occurred"
            }
            make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})
    print(id)
    print("finished execution")

# if __name__ == "__main__":
#     app.open()