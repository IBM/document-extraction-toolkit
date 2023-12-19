-- Deploy pdf-extractor:4.users to pg

BEGIN;

SET client_min_messages = 'warning';

-------------------------------------------------------------------------------------------------

-- create 'users' table to store users
CREATE TABLE data.users (
    id uuid_text NOT NULL DEFAULT uuid_generate_v1(),
    first_name text not null,
    last_name text not null,
    email text not null,
    company text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    primary key (id)
);

-------------------------------------------------------------------------------------------------

-- comments
COMMENT ON TABLE data.users IS
    'The table stores information about the users';

COMMENT ON COLUMN data.users.id IS
    'The user''s unique uuid';

COMMENT ON COLUMN data.users.first_name IS
    'The user''s first name';

COMMENT ON COLUMN data.users.last_name IS
    'The user''s last name';

COMMENT ON COLUMN data.users.email IS
    'The user''s email address';

COMMENT ON COLUMN data.users.company IS
    'The user''s company name';

COMMENT ON COLUMN data.users.created_at IS
    'The timestamp of when the user account was created';

COMMENT ON COLUMN data.users.updated_at IS
    'The timestamp of when the user account was updated';

create trigger set_updated_at_timestamp
before update on data.users
for each row execute procedure utils.trigger_set_timestamp();

COMMIT;
