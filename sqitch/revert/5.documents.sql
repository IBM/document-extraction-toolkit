-- Revert pdf-extractor:5.documents from pg

BEGIN;

SET client_min_messages = 'warning';

DROP TABLE IF EXISTS data.documents;

COMMIT;
