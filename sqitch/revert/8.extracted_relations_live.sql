-- Revert pdf-extractor:8.extracted_relations_live from pg

BEGIN;

SET client_min_messages = 'warning';

DROP TABLE IF EXISTS data.extracted_relations_live;

COMMIT;
