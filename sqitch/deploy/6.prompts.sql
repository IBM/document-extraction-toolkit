-- Deploy pdf-extractor:6.prompts to pg
-- requires: 8.extracted_relations_live

BEGIN;

SET client_min_messages = 'warning';

-------------------------------------------------------------------------------------------------

-- create 'prompts' table to store question based prompts configuration
CREATE TABLE data.prompts (
    id uuid_text NOT NULL DEFAULT uuid_generate_v1(),
    name text,
    prompt_type text,
    model_name text,
    model_configuration jsonb,
    template text,
    questions jsonb,
    user_id uuid_text REFERENCES data.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    primary key (id)
);

-------------------------------------------------------------------------------------------------

-- comments
COMMENT ON TABLE data.prompts IS
    'The table stores information about prompt configurations';

COMMENT ON COLUMN data.prompts.id IS
    'The prompt id - uuid';

COMMENT ON COLUMN data.prompts.prompt_type IS
    'The prompt type';

COMMENT ON COLUMN data.prompts.model_name IS
    'The model name used in the prompt';

COMMENT ON COLUMN data.prompts.model_configuration IS
    'A json object representing the model configuration';

COMMENT ON COLUMN data.prompts.template IS
    'The prompt template';

COMMENT ON COLUMN data.prompts.questions IS
    'A list of questions used in the prompt';


COMMENT ON COLUMN data.prompts.user_id IS
    'The user id';

COMMENT ON COLUMN data.prompts.updated_at IS
    'The timestamp of when the prompt is updated';

COMMENT ON COLUMN data.prompts.created_at IS
    'The timestamp of when the prompt was first created';

create trigger set_updated_at_timestamp
before update on data.prompts
for each row execute procedure utils.trigger_set_timestamp();


COMMIT;
