-- Verify pdf-extractor:7.jobs on pg

BEGIN;

SELECT id, doc_id, user_id, prompt_id
FROM data.jobs
WHERE FALSE;

ROLLBACK;
