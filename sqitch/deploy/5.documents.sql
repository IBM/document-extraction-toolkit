-- Deploy pdf-extractor:5.documents to pg
-- requires: 4.users
-- requires: 4.roles

BEGIN;

SET client_min_messages = 'warning';

-------------------------------------------------------------------------------------------------

-- create 'documents' table to store high-level document metadata
CREATE TABLE data.documents (
    id uuid_text NOT NULL DEFAULT uuid_generate_v1(),
    user_id uuid_text REFERENCES data.users(id),
    role_id uuid_text REFERENCES data.roles(id),
    name text not null,
    extension character varying(10),
    s3_key character varying(256) not null,
    s3_prefix character varying(120),
    s3_bucket character varying(120),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    page_length integer,
    md5_hash text,
    primary key(id)
);

-------------------------------------------------------------------------------------------------

-- comments
COMMENT ON TABLE data.documents IS
    'The table stores information about documents';

COMMENT ON COLUMN data.documents.id IS
    'The document id';

COMMENT ON COLUMN data.documents.user_id IS
    'The user id';

COMMENT ON COLUMN data.documents.role_id IS
    'The role id associated with this user, document pair';

COMMENT ON COLUMN data.documents.name IS
    'The original name of the document';

COMMENT ON COLUMN data.documents.extension IS
	'The extension for the document file';

COMMENT ON COLUMN data.documents.s3_key IS
	'The s3 key without file extension';

COMMENT ON COLUMN data.documents.s3_prefix IS
	'The s3 prefix';

COMMENT ON COLUMN data.documents.s3_bucket IS
	'The s3 bucket where the document file is saved';

COMMENT ON COLUMN data.documents.created_at IS
    'The timestamp of when the document was first uploaded';

COMMENT ON COLUMN data.documents.updated_at IS
    'The timestamp of when the document was last updated';

COMMENT ON COLUMN data.documents.page_length IS
    'The number of pages the document contains';

COMMENT ON COLUMN data.documents.md5_hash IS
    'The md5_hash of the document';

create trigger set_updated_at_timestamp
before update on data.documents
for each row execute procedure utils.trigger_set_timestamp();

COMMIT;
