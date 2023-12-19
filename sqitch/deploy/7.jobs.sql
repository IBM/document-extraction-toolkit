-- Deploy pdf-extractor:7.jobs to pg
-- requires: 5.documents
-- requires: 4.users

BEGIN;

SET client_min_messages = 'warning';

-------------------------------------------------------------------------------------------------

-- create 'jobs' table to store upload jobs
CREATE TABLE data.jobs (
    id uuid_text NOT NULL DEFAULT uuid_generate_v1(),
    prompt_id uuid_text REFERENCES data.prompts(id),
    percentage_loaded integer,
    task_status text,
    doc_id uuid_text REFERENCES data.documents(id) ON DELETE CASCADE,
    user_id uuid_text REFERENCES data.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    primary key (id)
);

-------------------------------------------------------------------------------------------------

-- comments
COMMENT ON TABLE data.jobs IS
    'The table stores information about uploading jobs progress';

COMMENT ON COLUMN data.jobs.id IS
    'The job id - uuid';

COMMENT ON COLUMN data.jobs.prompt_id IS
    'The prompt id used for this job';

COMMENT ON COLUMN data.jobs.percentage_loaded IS
    'The upload percentage (in increments of 20%)';

COMMENT ON COLUMN data.jobs.doc_id IS
    'The document id';

COMMENT ON COLUMN data.jobs.user_id IS
    'The user id';

COMMENT ON COLUMN data.jobs.task_status IS
    'The document task status';

COMMENT ON COLUMN data.jobs.updated_at IS
    'The timestamp of when the document upload status is updated';

COMMENT ON COLUMN data.jobs.created_at IS
    'The timestamp of when the document began uploading';

create trigger set_updated_at_timestamp
before update on data.jobs
for each row execute procedure utils.trigger_set_timestamp();


COMMIT;
