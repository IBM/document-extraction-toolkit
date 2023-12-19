-- Verify pdf-extractor:2.postgrest_roles on pg

BEGIN;

SET client_min_messages = 'warning';

-- load some variables from the env
\set anonymous `echo $DB_ANON_ROLE`
\set authenticator `echo $DB_USER`
\set reader `echo $DB_READER_ROLE`
\set writer `echo $DB_WRITER_ROLE`
\set manager `echo $DB_MANAGER_ROLE`

-- create all the applications user roles that are defined using the "user_role" type
-- we use a function here in order to be able add new roles just by redefining the type
create or replace function _temp_assert_roles("role" text) returns void as $$
begin
	ASSERT (SELECT 1 FROM pg_roles WHERE rolname = quote_ident(role)), quote_ident(role) || 'Role Not Found';
end;
$$  language plpgsql;;

select _temp_assert_roles(:'reader');
select _temp_assert_roles(:'writer');
select _temp_assert_roles(:'manager');
select _temp_assert_roles(:'anonymous');
select _temp_assert_roles(:'authenticator');

drop function _temp_assert_roles(text);

ROLLBACK;
