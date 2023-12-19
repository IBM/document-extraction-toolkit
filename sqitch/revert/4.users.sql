-- Revert pdf-extractor:4.users from pg

BEGIN;

SET client_min_messages = 'warning';

DROP TABLE IF EXISTS data.users;

COMMIT;
