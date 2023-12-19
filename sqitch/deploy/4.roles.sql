-- Deploy pdf-extractor:4.roles to pg

BEGIN;

SET client_min_messages = 'warning';

-------------------------------------------------------------------------------------------------

-- create 'roles' table to store roles
CREATE TABLE data.roles (
    id uuid_text NOT NULL DEFAULT uuid_generate_v1(),
    name text not null,
    description text,
    primary key (id)
);

-- initialize the 'roles' table to contain default roles (add roles here)
INSERT INTO data.roles (name, description)
VALUES
    ('owner', 'This user can make administrative changes to the document'),
    ('editor', 'This user can edit and view the document'),
    ('viewer', 'This user can only view the document');

-------------------------------------------------------------------------------------------------

-- comments
COMMENT ON TABLE data.roles IS
    'The table stores information about the user roles';

COMMENT ON COLUMN data.roles.name IS
    'The name of the role';

COMMENT ON COLUMN data.roles.description IS
    'The description of the role functions';

COMMIT;
