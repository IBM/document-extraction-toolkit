# ========== DEPENDENCIES ==========

# GENERAL
import os
import re
import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import defaultdict
import time

import pdfplumber
import pandas as pd
from pprint import pprint
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

# GENAI
# from genai.extensions.langchain import LangChainInterface # use the GA watsonx
#from genai.model import Credentials
#from genai.schemas import GenerateParams
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams

# Langchain
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.document_loaders import PyPDFLoader
from langchain.chains.question_answering import load_qa_chain

# PostgresT
from .postgrestclient import make_authenticated_request

# GA watsonx AAS
from .ibmlangchain import LangChainInterface

# ========== DEPENDENCIES END ==========

# ========== FUNCTIONS ==========

def watsonxai_model(model_name='google/flan-ul2', min_new_tokens=0, max_new_tokens=55, temperature=0.05):
    creds = get_creds()
    #params = GenerateParams(temperature=temperature, min_new_tokens=min_new_tokens, max_new_tokens=max_new_tokens)
    params = {
        #GenParams.DECODING_METHOD: decoding_method,
        GenParams.MIN_NEW_TOKENS: min_new_tokens,
        GenParams.MAX_NEW_TOKENS: max_new_tokens,
        #GenParams.RANDOM_SEED: random_seed,
        GenParams.TEMPERATURE: temperature,
        #GenParams.TOP_K: top_k,
        #GenParams.TOP_P: top_p,
        #GenParams.REPETITION_PENALTY: repetition_penalty,
        #GenParams.STOP_SEQUENCES: stop_sequences
    }
    project_id = get_project() # It might make sense to use a different project_id per prompt in the future. requires schema change
    # Instantiate a model proxy object to send your requests
    print(params)
    return LangChainInterface(model=model_name, credentials=creds, params=params, project_id=project_id)


def create_chain(llm, template, input_variables):
    prompt = PromptTemplate(template=template, input_variables=input_variables)
    chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt)
    return chain


def process_document_dynamic(document, prompt):
    # instantiate the qa_chain
    qa_llm = watsonxai_model(model_name=prompt["model_name"], min_new_tokens=prompt["model_configuration"]["min_new_tokens"], max_new_tokens=prompt["model_configuration"]["max_new_tokens"], temperature=prompt["model_configuration"]["temperature"])
    qa_template = prompt["template"]
    qa_chain = create_chain(qa_llm, qa_template, input_variables=["context", "question"])

    questions = [item["question"] for item in prompt["questions"]]
    fields = [item["field"] for item in prompt["questions"]]
    fields.append("page")
    inner_list_answers = []

    for question in questions:
        stuff_answer = qa_chain(
            {"input_documents": [document], "question": question},
            return_only_outputs=True
        )
        inner_list_answers.append(stuff_answer['output_text'])

    # keeping track of absolute page number
    inner_list_answers.append(document.metadata['page'])
   # inner_list_answers.append(document.metadata['page_info'])

    print(inner_list_answers)

    return inner_list_answers

def get_creds():
    load_dotenv()
    api_key = os.getenv("WML_APIKEY", None)
    api_endpoint = os.getenv("WML_ENDPOINT", None)
    if api_key is None or api_endpoint is None:
        raise Exception("Ensure .env file contains an WML_APIKEY and an WML_ENDPOINT")
    
    return {"apikey":api_key, "url":api_endpoint}

def get_project():
    load_dotenv()
    project_id = os.getenv("WML_PROJECT_ID")
    if project_id is None:
        raise Exception("Ensure .env file contains WML_PROJECT_ID")
    return project_id

def track_progress(document, executor, doc_id=None, prompt=None):
    future = executor.submit(process_document_dynamic, document, prompt)
    return future

def extract_relations(file_name, file_path, batch_size, max_concurrency, prompt, doc_id=None):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    print(f'init documents: {len(documents)}')
    fields = [item["field"] for item in prompt["questions"]]
    fields.append("page")
    df = pd.DataFrame(columns=fields)

    outer_list_answers = [] # comes from the iterative "questions" extraction
    job_id = None
    page_count = len(documents)
    print(f'page count: {page_count}')
    with ThreadPoolExecutor(max_concurrency) as executor:
        task_futures = []
        # Submit tasks and store their futures
        for doc_idx in range(len(documents)):
            task_future = track_progress(documents[doc_idx], executor, doc_id=doc_id, prompt=prompt)
            task_futures.append(task_future)

        print(f'init task_futures: {len(task_futures)}')

        while [future for future in task_futures if not future.done()]:
            completed = [future for future in task_futures if future.done()]
            remaining = [future for future in task_futures if not future.done()]

            num_completed = len(completed)
            num_remaining = len(remaining)
            print(f'progress: {num_remaining} / {num_completed} / {len(task_futures)}')
            if job_id:
                job = {
                    "id": job_id,
                    "doc_id":doc_id,
                    "percentage_loaded": round(num_completed/(num_remaining+num_completed)*50),
                    "task_status": "Running watsonX"
                }
                make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})
            else:
                job = {
                    "doc_id":doc_id,
                    "percentage_loaded": round(num_completed/(num_remaining+num_completed)*50),
                    "task_status": "Running watsonX"
                }
                job_id = make_authenticated_request("jobs", method="POST", data=job)[0]["id"]
            time.sleep(15)  # Adjust the polling interval as needed
        else:
            if job_id:
                job = {
                    "id": job_id,
                    "doc_id":doc_id,
                    "percentage_loaded": 50,
                    "task_status": "Finished watsonX"
                }
                make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})
            else:
                job = {
                    "doc_id":doc_id,
                    "percentage_loaded": 50,
                    "task_status": "Finished watsonX"
                }
                make_authenticated_request("jobs", method="POST", data=job)
        print(f'completed: {len(completed)}')
        print(f'task_futures: {len(task_futures)}')
        for batch_answers in task_futures:
            outer_list_answers.append(batch_answers.result())

    print(f'outer_list_answers: {len(outer_list_answers)}')

    for answer_row in outer_list_answers:
        df.loc[len(df)] = answer_row

    return (df.to_dict(orient='records'), outer_list_answers, job_id, page_count)

def highlight(extracted_relations_list, pdf_filepath, temp_dir, job_id=None, doc_id=None, prompt_id=None):
    # NLTK initialization
    nltk.download('punkt')
    nltk.download('stopwords')

    # create stop words list
    stop_words = set(stopwords.words('english'))

    # store relations to look for
    relation_dict = defaultdict(lambda: [])
    print(extracted_relations_list)
    # go through each relation, build the search terms of the relation and store them per page
    for relation in extracted_relations_list:
        page_field = len(relation) - 1

        search_terms = []
        for i in range(len(relation) - 1):
            term = re.sub(r'[^\w\s]', '', relation[i])
            term = re.sub(r'(?i)none', '', term)
            term = re.sub(r'(?i)answer', '', term)
            term = re.sub(r'(?i)context', '', term)
            term = re.sub(r'(?i)available', '', term)            

            # tokenize
            term = word_tokenize(term)

            # remove stop words
            term = [w for w in term if not w.lower() in stop_words]

            # remove single letters
            term = [w for w in term if len(w) > 1]

            # list of strings with all information corresponding to a record
            search_terms = search_terms + term

        # add it to the existing list of search terms for that page (relation[4] is 'absolute page no.')
        relation_dict[relation[page_field]] = relation_dict[relation[page_field]] + ["(?i)" + i for i in search_terms]


    # open the pdf using pdfplumber
    pdf = pdfplumber.open(pdf_filepath)

    # highlighted_pages keeps track of the saved_names for all pages, highlighted_mask is a T/F list corresponding to if a page has a relation on it
    highlighted_pages = []
    highlighted_mask = [False] * len(pdf.pages)

    # keep track of progress
    total_pdf_pages = len(pdf.pages)

    # for every page number with a highlight, set to True
    for page_no in relation_dict.keys():
        highlighted_mask[page_no] = True

    # iterate through each page, highlighting search terms
    for ind, page in enumerate(pdf.pages):

        # create image of the page
        im = page.to_image(resolution=150)

        # this set keeps track of bounding boxes already drawn on this page (prevents double highlight)
        drawn = set()

        # the strings to highlight on the page
        search_terms = relation_dict[ind]

        for term in search_terms:

            try:
                for match in page.search(term):
                    bbox = (match['x0'], match['top'], match['x1'], match['bottom'])
                    if bbox not in drawn:
                        print(f'drew box on page {ind}')
                        im.draw_rect(bbox, fill=(200, 100, 0, 127))
                        drawn.add(bbox)

            except Exception as e:
                print(f'Exception when searching for term {term} on page {ind}:')
                print(e)

        saved_name = '{}_{}.png'.format(pdf_filepath.split('/')[-1], ind + 1)
        im.save(os.path.join(temp_dir, saved_name))
        highlighted_pages.append(saved_name)

        if job_id:
            job = {
                "id": job_id,
                "doc_id":doc_id,
                "prompt_id": prompt_id,
                "percentage_loaded": round(ind/(total_pdf_pages)*40)+50,
                "task_status": "Processing PDF"
            }
            make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})

    # iterate through the mask, also setting items adjacent to Trues to True as well
    # uploads .png for pages with relations or those immediately adjacent to pages with relations
    highlighted_mask_out = highlighted_mask.copy()

    for ind, item in enumerate(highlighted_mask):
        if item is True:
            # flip page before to true
            try:
                highlighted_mask_out[ind-1] = True
            except:
                pass

            # flip page after to true
            try:
                highlighted_mask_out[ind+1] = True
            except:
                pass

    if job_id:
        job = {
            "id": job_id,
            "doc_id":doc_id,
            "percentage_loaded": 90,
            "task_status": "Finished PDF"
        }
        make_authenticated_request("jobs", method="PUT", data=job,  query_params={"id":f"eq.{job_id}"})

    return highlighted_pages, highlighted_mask_out

