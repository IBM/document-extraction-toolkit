-- Deploy pdf-extractor:3.data_schema to pg

BEGIN;

SET client_min_messages = 'warning';

\set anonymous `echo $DB_ANON_ROLE`
\set authenticator `echo $DB_USER`
\set reader `echo $DB_READER_ROLE`
\set writer `echo $DB_WRITER_ROLE`
\set manager `echo $DB_MANAGER_ROLE`

drop schema if exists data cascade;
create schema data;

grant usage on schema data to :"anonymous", :"reader", :"writer", :"manager";
grant create on schema data to :"manager";

-- remember to add roles to ibm-cloud-base-user when deploying to IBM Cloud Postgres

ALTER DEFAULT PRIVILEGES IN SCHEMA data GRANT ALL ON FUNCTIONS TO :"reader";

ALTER DEFAULT PRIVILEGES IN SCHEMA data GRANT SELECT ON TABLES TO :"reader";
ALTER DEFAULT PRIVILEGES IN SCHEMA data GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO :"writer";
ALTER DEFAULT PRIVILEGES IN SCHEMA data GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO :"writer";

grant usage on schema public to :"anonymous", :"reader", :"writer", :"manager";
grant create on schema public to :"manager";

-- remember to add roles to ibm-cloud-base-user when deploying to IBM Cloud Postgres

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO :"reader";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO :"reader";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO :"reader";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO :"writer";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO :"writer";

-- this is for allowing ilike and other functions to work properly with postgresT
-- all columns using UUID need to use this uuid_text type instead

CREATE DOMAIN uuid_text AS TEXT;

CREATE OR REPLACE FUNCTION uuid_text_cast(uuid_column UUID)
RETURNS uuid_text AS $$
BEGIN
    RETURN uuid_column::TEXT;
END;
$$ LANGUAGE plpgsql;

CREATE CAST (UUID AS uuid_text) WITH FUNCTION uuid_text_cast(UUID);

COMMIT;
