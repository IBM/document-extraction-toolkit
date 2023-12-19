-- Revert pdf-extractor:3.data_schema from pg

BEGIN;

SET client_min_messages = 'warning';

drop schema if exists data cascade;

COMMIT;
