-- Revert pdf-extractor:4.roles from pg

BEGIN;

SET client_min_messages = 'warning';

DROP TABLE IF EXISTS data.roles;

COMMIT;
