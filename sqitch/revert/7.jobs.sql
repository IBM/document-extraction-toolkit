-- Revert pdf-extractor:7.jobs from pg

BEGIN;

SET client_min_messages = 'warning';

DROP TABLE IF EXISTS data.jobs;

COMMIT;
