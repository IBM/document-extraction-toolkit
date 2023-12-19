-- Deploy pdf-extractor:2.postgrest_roles to pg


BEGIN;
SET client_min_messages = 'warning';
-------------------------------------------------------------------------------------------------
-- load some variables from the env
\set anonymous `echo $DB_ANON_ROLE`
\set authenticator `echo $DB_USER`
\set authenticator_pass `echo $DB_PASS`
\set reader `echo $DB_READER_ROLE`
\set writer `echo $DB_WRITER_ROLE`
\set manager `echo $DB_MANAGER_ROLE`
-------------------------------------------------------------------------------------------------
-- the role used by postgrest to connect to the database
-- notice how this role does not have any privileges attached specifically to it
-- it can only switch to other roles
-- drop role if exists :"authenticator";
-- Revised all drops to check if not exists, since supautils breaks the drop role if exists statement
--\set

CREATE OR REPLACE FUNCTION create_role_if_not_exists(rolename NAME, role_pass text) RETURNS TEXT AS
$$
BEGIN
    IF NOT EXISTS (SELECT * FROM pg_roles WHERE rolname = rolename) THEN
        EXECUTE format('CREATE ROLE %I WITH noinherit LOGIN PASSWORD %L', rolename, role_pass);
        RETURN format('CREATE ROLE %I WITH noinherit LOGIN PASSWORD XXXX', rolename, role_pass);
    ELSE
        RETURN format('ROLE ''%I'' ALREADY EXISTS', rolename);
    END IF;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_role_if_not_exists_nologin(rolename NAME) RETURNS TEXT AS
$$
BEGIN
    IF NOT EXISTS (SELECT * FROM pg_roles WHERE rolname = rolename) THEN
        EXECUTE format('CREATE ROLE %I nologin', rolename);
        RETURN format('CREATE ROLE %I nologin', rolename);
    ELSE
        RETURN format('ROLE ''%I'' ALREADY EXISTS', rolename);
    END IF;
END;
$$
LANGUAGE plpgsql;


SELECT create_role_if_not_exists(:'authenticator', :'authenticator_pass');

-- CREATE ROLE :"authenticator" noinherit LOGIN PASSWORD :'authenticator_pass';

-------------------------------------------------------------------------------------------------
-- this is an application level role
-- requests that are not authenticated will be executed with this role's privileges
-- drop role if exists :"anonymous";

--CREATE ROLE :"anonymous" nologin;
SELECT create_role_if_not_exists_nologin(:'anonymous');
GRANT :"anonymous" TO :"authenticator";


-------------------------------------------------------------------------------------------------
-- requests that are authenticated with reader role will be executed with this role's privileges
-- drop role if exists reader;

SELECT create_role_if_not_exists_nologin(:'reader');
GRANT :"reader" TO :"authenticator";

-------------------------------------------------------------------------------------------------
-- requests that are authenticated with writer role will be executed with this role's privileges
-- drop role if exists writer;

--CREATE ROLE writer nologin;
SELECT create_role_if_not_exists_nologin(:'writer');
GRANT :"writer" TO :"authenticator";

-- writer inherits reader
GRANT :"reader" TO :"writer";
-------------------------------------------------------------------------------------------------
-- requests that are authenticated with manager role will be executed with this role's privileges

--CREATE ROLE manager nologin;
SELECT create_role_if_not_exists_nologin(:'manager');
GRANT :"manager" TO :"authenticator";

-- drop role if exists manager;
-- manager inherits writer
GRANT :"writer" TO :"manager";

COMMIT;

--END;