-- Deploy pdf-extractor:8.extracted_relations_live to pg
-- requires: 5.documents
-- requires: 4.users

BEGIN;

SET client_min_messages = 'warning';

-------------------------------------------------------------------------------------------------

-- create 'extracted_relations_live' table to store current relations
CREATE TABLE data.extracted_relations_live (
    id uuid_text NOT NULL DEFAULT uuid_generate_v1(),
    doc_id uuid_text REFERENCES data.documents(id) ON DELETE CASCADE,
    prompt_id uuid_text REFERENCES data.prompts(id),
    user_id uuid_text,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT now(),
    extraction_summary text,
    extraction_results jsonb,
    page_info text,
    comments text,
    needs_review boolean default true,
    index_start text,
    index_end text,
    s3_key character varying(256) not null,
    s3_bucket character varying(120),
    primary key (id)
);

-------------------------------------------------------------------------------------------------

-- comments

COMMENT ON TABLE data.extracted_relations_live IS
    'The table stores information about live extracted relations';

COMMENT ON COLUMN data.extracted_relations_live.id IS
    'The relation id - uuid';

COMMENT ON COLUMN data.extracted_relations_live.doc_id IS
    'The document id';

COMMENT ON COLUMN data.extracted_relations_live.prompt_id IS
    'The prompt id';

COMMENT ON COLUMN data.extracted_relations_live.user_id IS
    'The user id';

COMMENT ON COLUMN data.extracted_relations_live.updated_at IS
    'The date of when the relation was updated';

COMMENT ON COLUMN data.extracted_relations_live.created_at IS
    'The date of when the relation was created';

COMMENT ON COLUMN data.extracted_relations_live.extraction_results IS
    'A JSON object representing the extracted data';

COMMENT ON COLUMN data.extracted_relations_live.extraction_summary IS
    'A summarized text version of the extraction data';

COMMENT ON COLUMN data.extracted_relations_live.comments IS
    'Field for saving user comments';

COMMENT ON COLUMN data.extracted_relations_live.needs_review IS
    'Indicating if the record was modified by a user';

COMMENT ON COLUMN data.extracted_relations_live.index_start IS
    'The start index of the passage with the information';

COMMENT ON COLUMN data.extracted_relations_live.index_start IS
    'The end index of the passage with the information';

create trigger set_updated_at_timestamp
before update on data.extracted_relations_live
for each row execute procedure utils.trigger_set_timestamp();


COMMIT;
