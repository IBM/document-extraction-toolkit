-- Revert pdf-extractor:6.prompts from pg

BEGIN;

DROP TABLE IF EXISTS data.prompts;

COMMIT;