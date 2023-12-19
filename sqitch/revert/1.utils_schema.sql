-- Revert pdf-extractor:1.utils_schema from pg

BEGIN;

SET client_min_messages = 'warning';

drop schema if exists utils cascade;

COMMIT;
