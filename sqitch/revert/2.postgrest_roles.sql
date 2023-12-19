-- Revert pdf-extractor:2.postgrest_roles from pg
BEGIN;

SET client_min_messages = 'warning';

-- load some variables from the env
\set anonymous `echo $DB_ANON_ROLE`
\set authenticator `echo $DB_USER`
\set reader `echo $DB_READER_ROLE`
\set writer `echo $DB_WRITER_ROLE`
\set manager `echo $DB_MANAGER_ROLE`

drop role if exists :"reader";
drop role if exists :"writer";
drop role if exists :"manager";
drop role if exists :"anonymous";
drop role if exists :"authenticator";

COMMIT;
